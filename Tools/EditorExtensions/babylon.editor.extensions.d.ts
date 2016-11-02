declare module BABYLON.EDITOR.EXTENSIONS {
    interface IEditorExtension<T> {
        extensionKey: string;
        apply(data: T): void;
        applyEvenIfDataIsNull: boolean;
    }
    type _EditorExtensionConstructor = new <T>(scene: Scene) => IEditorExtension<T>;
    class EditorExtension {
        private static _ExtensionsDatas;
        private static _Extensions;
        static LoadExtensionsFile(url: string, callback?: () => void): void;
        static GetExtensionData<T>(key: string): T;
        static ApplyExtensions(scene: Scene): void;
        static RegisterExtension(extension: _EditorExtensionConstructor): void;
    }
}
declare module BABYLON.EDITOR.EXTENSIONS {
    interface IPostProcessExtensionData {
        id: string;
        name: string;
        program: string;
        configuration: string;
        postProcess?: PostProcess;
    }
    interface IPostProcessExtensionConfiguration {
        ratio: number;
        defines: string[];
    }
    class PostProcessBuilderExtension implements IEditorExtension<IPostProcessExtensionData[]> {
        extensionKey: string;
        applyEvenIfDataIsNull: boolean;
        placeHolderTexture: Texture;
        private _scene;
        private _scenePassPostProcess;
        /**
        * Constructor
        * @param core: the editor core
        */
        constructor(scene: Scene);
        apply(data: IPostProcessExtensionData[]): void;
        removePostProcess(postProcess: PostProcess): void;
        applyPostProcess(data: IPostProcessExtensionData): void;
        private _postProcessCallback(postProcess);
    }
}
declare module BABYLON.EDITOR.EXTENSIONS {
    interface IBotRoot {
        groups: IBotGroup[];
    }
    interface IBotFunction {
        title: string;
    }
    interface IBotGroup {
        title: string;
        functions: IBotFunction[];
    }
    interface ICosmosConfiguration {
        distanceToRoot: number;
        distanceToFunction: number;
        heightFromRoot: number;
        functionsDistance: number;
        animationsDistance: number;
        sphereDiameter: number;
    }
    class CosmosExtension implements IEditorExtension<ICosmosConfiguration> {
        extensionKey: string;
        applyEvenIfDataIsNull: boolean;
        distanceToRoot: number;
        distanceToFunction: number;
        heightFromRoot: number;
        functionsDistance: number;
        animationsDistance: number;
        sphereDiameter: number;
        private _scene;
        private _galaxies;
        private _sphereMesh;
        private _cameraTarget;
        static _BotDatas: IBotRoot;
        /**
        * Constructor
        * @param core: the editor core
        */
        constructor(scene: Scene);
        apply(data: ICosmosConfiguration): void;
        reset(): void;
        updateMeshes(): void;
        animateCameraToId(id: string): void;
        private _createCosmosGalaxy(name, rootPosition, names, distance, animate);
        private _loadBotDatas(callback);
    }
}
declare module BABYLON {
    class StartParticleSystemAction extends Action {
        private _particleSystem;
        constructor(triggerOptions: any, particleSystem: ParticleSystem, condition?: Condition);
        _prepare(): void;
        execute(): void;
        serialize(parent: any): any;
    }
    class StopParticleSystemAction extends Action {
        private _particleSystem;
        constructor(triggerOptions: any, particleSystem: ParticleSystem, condition?: Condition);
        _prepare(): void;
        execute(): void;
        serialize(parent: any): any;
    }
}
