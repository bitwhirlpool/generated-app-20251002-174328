import type { Message } from '../../worker/types';
const formatDate = (timestamp: number) => new Date(timestamp).toISOString();
export const exportToMarkdown = (messages: Message[], title: string): string => {
  let markdown = `# Chat Session: ${title}\n\n`;
  messages.forEach(message => {
    const author = message.role === 'user' ? 'User' : 'Assistant';
    const timestamp = formatDate(message.timestamp);
    markdown += `**${author}** (_${timestamp}_):\n\n`;
    markdown += `${message.content}\n\n`;
    if (message.toolCalls && message.toolCalls.length > 0) {
      markdown += `*Tools Used:*\n`;
      message.toolCalls.forEach(tool => {
        markdown += `- \`${tool.name}\` with arguments: \`${JSON.stringify(tool.arguments)}\`\n`;
      });
      markdown += `\n`;
    }
    markdown += '---\n\n';
  });
  return markdown;
};
export const exportToJson = (messages: Message[], title: string): string => {
  const data = {
    title,
    exportedAt: new Date().toISOString(),
    session: messages,
  };
  return JSON.stringify(data, null, 2);
};
export const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};