interface IScript {
    start?: () => void;
    update?: () => void;
    [index: string]: any;
}

interface ICustomMaterial {
    code: CustomMaterial;
    material: BABYLON.PushMaterial;
}

interface ICustomPostProcess {
    code: CustomPostProcess;
    postprocess: BABYLON.PostProcess;
}

/**
 * Main interface
 */
interface BehaviorCodeTools {
    getCustomScript (objectName: any, name: string): IScript;
    getCustomMaterial (name: string): ICustomMaterial;
    getCustomPostProcess (name: string): ICustomPostProcess;
    getFileByName (name: string): File;
    getFileUrl (filename: string, oneTimeOnly?: boolean): string;
    getPathFinder (name: string): PathFinder;
}
