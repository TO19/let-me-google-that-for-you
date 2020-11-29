import { Test } from "mocha";
import {
  commands,
  ExtensionContext,
  Position,
  Uri,
  window,
  workspace,
} from "vscode";

// Enums
enum Google {
  name = "google",
  section = "letMeGoogleItForYou",
  url = "QueryTemplateGoogle",
  command = "extension.letMeGoogleItForYou",
}

enum StackOverflow {
  name = "StackOverflow",
  section = "letMeStackItForYou",
  url = "QueryTemplateStackOverflow",
  command = "extension.letMeStackItForYou",
}

export function activate(context: ExtensionContext): void {
  const googleDisposable = commands.registerTextEditorCommand(
    Google.command,
    googleSearch
  );
  const stackOverflowDisposable = commands.registerTextEditorCommand(
    StackOverflow.command,
    stackOverflow
  );
  context.subscriptions.push(googleDisposable, stackOverflowDisposable);
}

// Empty Deactivate Function
export function deactivate(): void {}

// Functions to perform a research
function googleSearch() {
  performSearch(Google.name);
}

function stackOverflow(): any {
  performSearch(StackOverflow.name);
}

function performSearch(searchEngine: string) {
  const selectedText = getSelectedText();
  if (!selectedText) {
    return;
  }
  const searchTerm = encodeURI(selectedText);
  const configs = workspace.getConfiguration(
    Google.name === searchEngine ? Google.section : StackOverflow.section
  );
  const queryTemplateUrl = configs.get(
    Google.name === searchEngine ? Google.url : StackOverflow.url
  ) as string;
  const query = queryTemplateUrl.replace("searchTerm", searchTerm);
  commands.executeCommand("vscode.open", Uri.parse(query));
}

// getSelectedText creates a URL for search based on the selection
function getSelectedText(): string {
  const documentText = window?.activeTextEditor?.document.getText();
  if (!documentText) {
    return "";
  }
  const activeSelection = window?.activeTextEditor?.selection;
  if (activeSelection?.isEmpty) {
    return "";
  }
  const selStartoffset = window?.activeTextEditor?.document.offsetAt(
    activeSelection?.start as Position
  );
  const selEndOffset = window?.activeTextEditor?.document.offsetAt(
    activeSelection?.end as Position
  );

  let selectedText = documentText.slice(selStartoffset, selEndOffset).trim();
  return selectedText.replace(/\s\s+/g, " ");
}
