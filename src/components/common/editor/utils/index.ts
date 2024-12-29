export const execCommand = (command: string, value: string | null = null) => {
  document.execCommand(command, false, value);
};
