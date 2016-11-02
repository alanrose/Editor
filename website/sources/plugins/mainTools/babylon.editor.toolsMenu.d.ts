declare module BABYLON.EDITOR {
    class ToolsMenu implements ICustomToolbarMenu {
        menuID: string;
        private _core;
        private _openActionsBuilder;
        private _openPostProcessBuilder;
        private _openCosmos;
        /**
        * Constructor
        * @param mainToolbar: the main toolbar instance
        */
        constructor(mainToolbar: MainToolbar);
        onMenuItemSelected(selected: string): void;
    }
}
