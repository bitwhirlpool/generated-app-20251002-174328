import { Hono } from "hono";
import { getAgentByName } from 'agents';
import { ChatAgent } from './agent';
import { API_RESPONSES } from './config';
import { Env, getAppController, registerSession, unregisterSession } from "./core-utils";
import { ChatHandler } from "./chat";
/**
 * DO NOT MODIFY THIS FUNCTION. Only for your reference.
 */
export function coreRoutes(app: Hono<{ Bindings: Env }>) {
    // Use this API for conversations. **DO NOT MODIFY**
    app.all('/api/chat/:sessionId/*', async (c) => {
        try {
        const sessionId = c.req.param('sessionId');
        const agent = await getAgentByName<Env, ChatAgent>(c.env.CHAT_AGENT, sessionId); // Get existing agent or create a new one if it doesn't exist, with sessionId as the name
        const url = new URL(c.req.url);
        url.pathname = url.pathname.replace(`/api/chat/${sessionId}`, '');
        return agent.fetch(new Request(url.toString(), {
            method: c.req.method,
            headers: c.req.header(),
            body: c.req.method === 'GET' || c.req.method === 'DELETE' ? undefined : c.req.raw.body
        }));
        } catch (error) {
        console.error('Agent routing error:', error);
        return c.json({
            success: false,
            error: API_RESPONSES.AGENT_ROUTING_FAILED
        }, { status: 500 });
        }
    });
}
export function userRoutes(app: Hono<{ Bindings: Env }>) {
    // Add your routes here
    /**
     * List all chat sessions
     * GET /api/sessions
     */
    app.get('/api/sessions', async (c) => {
        try {
            const controller = getAppController(c.env);
            const sessions = await controller.listSessions();
            return c.json({ success: true, data: sessions });
        } catch (error) {
            console.error('Failed to list sessions:', error);
            return c.json({
                success: false,
                error: 'Failed to retrieve sessions'
            }, { status: 500 });
        }
    });
    /**
     * Create a new chat session
     * POST /api/sessions
     * Body: { title?: string, sessionId?: string }
     */
    app.post('/api/sessions', async (c) => {
        try {
            const body = await c.req.json().catch(() => ({}));
            const { title, sessionId: providedSessionId, firstMessage } = body;
            const sessionId = providedSessionId || crypto.randomUUID();
            // Generate better session titles
            let sessionTitle = title;
            if (!sessionTitle) {
                const now = new Date();
                const dateTime = now.toLocaleString([], {
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                if (firstMessage && firstMessage.trim()) {
                    const cleanMessage = firstMessage.trim().replace(/\s+/g, ' ');
                    const truncated = cleanMessage.length > 40
                        ? cleanMessage.slice(0, 37) + '...'
                        : cleanMessage;
                    sessionTitle = `${truncated} • ${dateTime}`;
                } else {
                    sessionTitle = `Chat ${dateTime}`;
                }
            }
            await registerSession(c.env, sessionId, sessionTitle);
            return c.json({
                success: true,
                data: { sessionId, title: sessionTitle }
            });
        } catch (error) {
            console.error('Failed to create session:', error);
            return c.json({
                success: false,
                error: 'Failed to create session'
            }, { status: 500 });
        }
    });
    /**
     * Delete a chat session
     * DELETE /api/sessions/:sessionId
     */
    app.delete('/api/sessions/:sessionId', async (c) => {
        try {
            const sessionId = c.req.param('sessionId');
            const deleted = await unregisterSession(c.env, sessionId);
            if (!deleted) {
                return c.json({
                    success: false,
                    error: 'Session not found'
                }, { status: 404 });
            }
            return c.json({ success: true, data: { deleted: true } });
        } catch (error) {
            console.error('Failed to delete session:', error);
            return c.json({
                success: false,
                error: 'Failed to delete session'
            }, { status: 500 });
        }
    });
    /**
     * Update session title
     * PUT /api/sessions/:sessionId/title
     * Body: { title: string }
     */
    app.put('/api/sessions/:sessionId/title', async (c) => {
        try {
            const sessionId = c.req.param('sessionId')
            const { title: newTitle, firstMessage } = await c.req.json()

            let finalTitle = newTitle
            if (!finalTitle && firstMessage) {
                const now = new Date()
                const dateTime = now.toLocaleString([], { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
                const cleanMessage = firstMessage.trim().replace(/\s+/g, ' ')
                const truncated = cleanMessage.length > 40 ? cleanMessage.slice(0, 37) + '...' : cleanMessage
                finalTitle = `${truncated} • ${dateTime}`
            }

            if (!finalTitle || typeof finalTitle !== 'string') {
                return c.json({
                    success: false,
                    error: 'A valid title or firstMessage is required'
                }, { status: 400 });
            }
            const controller = getAppController(c.env);
            const updated = await controller.updateSessionTitle(sessionId, finalTitle);
            if (!updated) {
                return c.json({
                    success: false,
                    error: 'Session not found'
                }, { status: 404 });
            }
            return c.json({ success: true, data: { title: finalTitle } });
        } catch (error) { 
            console.error('Failed to update session title:', error);
            return c.json({
                success: false,
                error: 'Failed to update session title'
            }, { status: 500 });
        }
    });
    /**
     * Get session count and stats
     * GET /api/sessions/stats
     */
    app.get('/api/sessions/stats', async (c) => {
        try {
            const controller = getAppController(c.env);
            const count = await controller.getSessionCount();
            return c.json({
                success: true,
                data: { totalSessions: count }
            });
        } catch (error) {
            console.error('Failed to get session stats:', error);
            return c.json({
                success: false,
                error: 'Failed to retrieve session stats'
            }, { status: 500 });
        }
    });
    /**
     * Clear all chat sessions
     * DELETE /api/sessions
     */
    app.delete('/api/sessions', async (c) => {
        try {
            const controller = getAppController(c.env);
            const deletedCount = await controller.clearAllSessions();
            return c.json({
                success: true,
                data: { deletedCount }
            });
        } catch (error) {
            console.error('Failed to clear all sessions:', error);
            return c.json({
                success: false,
                error: 'Failed to clear all sessions'
            }, { status: 500 });
        }
    });
    /**
     * AI Prompt Builder endpoint
     * POST /api/generate-prompt
     * Body: { goal: string }
     */
    app.post('/api/generate-prompt', async (c) => {
        try {
            const { goal } = await c.req.json();
            if (!goal || typeof goal !== 'string') {
                return c.json({ success: false, error: 'Goal is required' }, { status: 400 });
            }
            const chatHandler = new ChatHandler(
                c.env.CF_AI_BASE_URL,
                c.env.CF_AI_API_KEY,
                'google-ai-studio/gemini-2.5-flash' // Use a fast model for this task
            );
            const systemPrompt = `You are an expert prompt engineer. Based on the user's goal, generate 3 distinct, high-quality, and effective prompts. The prompts should be creative, clear, and designed to elicit the best possible response from a large language model. Return the prompts as a JSON array of strings. For example: ["prompt 1", "prompt 2", "prompt 3"]. Do not include any other text or markdown formatting.`;
            const userMessage = `My goal is: "${goal}"`;
            const response = await chatHandler.processMessage(userMessage, [{
                role: 'system',
                content: systemPrompt,
                id: 'system-prompt',
                timestamp: Date.now()
            }]);
            // Attempt to parse the JSON array from the response content
            try {
                const prompts = JSON.parse(response.content);
                if (Array.isArray(prompts) && prompts.every(p => typeof p === 'string')) {
                    return c.json({ success: true, data: prompts });
                }
                throw new Error("Invalid format");
            } catch (e) {
                 // Fallback for non-JSON responses
                const cleanedResponse = response.content
                    .replace(/```json\n?/, '')
                    .replace(/```$/, '')
                    .trim();
                try {
                    const prompts = JSON.parse(cleanedResponse);
                     if (Array.isArray(prompts) && prompts.every(p => typeof p === 'string')) {
                        return c.json({ success: true, data: prompts });
                    }
                } catch (e2) {
                    console.error("Failed to parse AI response for prompt generation:", response.content);
                    return c.json({ success: false, error: "The AI returned an invalid response. Please try rephrasing your goal." }, { status: 500 });
                }
            }
        } catch (error) {
            console.error('Failed to generate prompts:', error);
            return c.json({ success: false, error: 'Failed to generate prompts' }, { status: 500 });
        }
    });
}