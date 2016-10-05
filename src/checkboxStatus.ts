import * as helpers from './helpers';
import { Disposable, StatusBarItem, StatusBarAlignment, window, workspace } from 'vscode';

export class CheckboxStatus {
    private _statusBarItem: StatusBarItem;

    public updateCheckboxStatus() {
        if (!this._statusBarItem) {
            this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right);
        }

        let editor = window.activeTextEditor;
        if (!editor) {
            this._statusBarItem.hide();
            return;
        }

        let doc = editor.document;

        if (doc.languageId === "markdown") {            
            let allCheckboxes = helpers.getAllCheckboxes(doc);

            let checkedCheckboxes = allCheckboxes.filter(cb => cb.checked);            

            // update status bar
            this._statusBarItem.text = checkedCheckboxes.length + '/' + allCheckboxes.length + ' checkboxes';
            this._statusBarItem.show();
        } else {
            this._statusBarItem.hide();
        }
    }

    public dispose() {
        this._statusBarItem.dispose();
    }
}

export class CheckboxStatusController {
    private _checkboxStatus: CheckboxStatus;
    private _disposable: Disposable;

    constructor(checkboxStatus: CheckboxStatus) {
        this._checkboxStatus = checkboxStatus;
        this._checkboxStatus.updateCheckboxStatus();

        let subscriptions: Disposable[] = [];
        workspace.onDidChangeTextDocument(this._onEvent, this, subscriptions);
        window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);

        this._disposable = Disposable.from(...subscriptions);
    }

    private _onEvent() {
        this._checkboxStatus.updateCheckboxStatus();
    }

    public dispose() {
        this._disposable.dispose();
    }
}