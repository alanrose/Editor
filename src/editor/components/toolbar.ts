import Editor from '../editor';
import { IEditorPlugin } from '../typings/plugin';

import Toolbar from '../gui/toolbar';
import Window from '../gui/window';
import Dialog from '../gui/dialog';

import Tools from '../tools/tools';
import UndoRedo from '../tools/undo-redo';

import SceneExporter from '../scene/scene-exporter';
import SceneFactory from '../scene/scene-factory';
import SceneImporter from '../scene/scene-importer';
import SceneManager from '../scene/scene-manager';
import SceneSerializer from '../scene/scene-serializer';
import { GizmoType } from '../scene/scene-picker';

export default class EditorToolbar {
    // Public members
    public main: Toolbar;
    public tools: Toolbar;

    /**
     * Constructor
     * @param editor: the editor's reference
     */
    constructor (protected editor: Editor) {
        // Build main toolbar
        this.main = new Toolbar('MainToolBar');
        this.main.items = [
            {
                type: 'menu', id: 'project', text: 'Project', img: 'icon-folder', items: [
                    { id: 'import-project', img: 'icon-export', text: 'Import Project...' },
                    { id: 'reload-project', img: 'icon-copy', text: 'Reload...' },
                    { id: 'download-project', img: 'icon-export', text: 'Download Project...' },
                    { type: 'break' },
                    { id: 'clean-project', img: 'icon-copy', text: 'Clean Project...' },
                    { type: 'break' },
                    { id: 'export-project', img: 'icon-files', text: 'Export Project...' },
                    { id: 'export-template', img: 'icon-files-project', text: 'Export Template...' },
                    { type: 'break' },
                    { id: 'serialize-scene', img: 'icon-copy', text: 'Export Scene As...' }
                ]
            },
            { type: 'break' },
            {
                type: 'menu', id: 'edit', text: 'Edit', img: 'icon-edit', items: [
                    { id: 'undo', img: 'icon-undo', text: 'Undo' },
                    { id: 'redo', img: 'icon-redo', text: 'Redo' },
                    { type: 'break' },
                    { id: 'clean-materials', img: 'icon-recycle', text: 'Clean Unused Materials' },
                    { id: 'clean-textures', img: 'icon-recycle', text: 'Clean Unused Textures' }
                ]
            },
            { type: 'break' },
            {
                type: 'menu', id: 'view', text: 'View', img: 'icon-helpers', items: [
                    { id: 'animations', img: 'icon-animators', text: 'Animations...' },
                    { type: 'break' },
                    { id: 'textures', img: 'icon-copy', text: 'Textures...' },
                    { id: 'materials', img: 'icon-effects', text: 'Materials...' },
                    { type: 'break ' },
                    { id: 'code', img: 'icon-behavior-editor', text: 'Code...' },
                    { id: 'material-creator', img: 'icon-shaders', text: 'Material Creator' },
                    { id: 'post-process-creator', img: 'icon-shaders', text: 'Post-Process Creator' },
                    //{ id: 'particles-creator', img: 'icon-particles', text: 'Particles Creator' },
                    { type: 'break' },
                    { id: 'path-finder', img: 'icon-graph', text: 'Path Finder' }
                ]
            },
            { type: 'break' },
            {
                type: 'menu', id: 'add', text: 'Add', img: 'icon-add', items: [
                    { id: 'particle-system', img: 'icon-particles', text: 'Particle System' },
                    { id: 'particle-system-animated', img: 'icon-particles', text: 'Animated Particle System' },
                    { type: 'break;' },
                    { id: 'sky', img: 'icon-shaders', text: 'Sky Effect' },
                    { id: 'water', img: 'icon-water', text: 'Water Effect' },
                    { type: 'break' },
                    { id: 'ground', img: 'icon-mesh', text: 'Ground Mesh' },
                    { id: 'cube', img: 'icon-box-mesh', text: 'Cube Mesh' },
                    { id: 'sphere', img: 'icon-sphere-mesh', text: 'Sphere Mesh' },
                    { type: 'break' },
                    { id: 'point-light', img: 'icon-light', text: 'Point Light' },
                    { id: 'directional-light', img: 'icon-directional-light', text: 'Directional Light' },
                    { id: 'spot-light', img: 'icon-directional-light', text: 'Spot Light' },
                    { id: 'hemispheric-light', img: 'icon-light', text: 'Hemispheric Light' },
                    { type: 'break' },
                    { id: 'sound', img: 'icon-sound', text: 'Sound' }
                ]
            },
            // TODO: wait for parse and serialize for GUI
            // { type: 'break' },
            // {
            //     type: 'menu', id: 'gui', text: 'Gui', img: 'icon-lens-flare', items: [
            //         { id: 'add-advanced-texture', img: 'icon-ground', text: 'Add Advanced Texture' },
            //         { id: 'add-image', img: 'icon-dynamic-texture', text: 'Add Image' }
            //     ]
            // },
        ];
        this.main.onClick = target => this.onMainClick(target);
        this.main.build('MAIN-TOOLBAR');

        // Build toolbar
        this.tools = new Toolbar('ToolsToolBar');
        this.tools.items = [
            { type: 'check', id: 'play', text: 'Play', img: 'icon-play-game' },
            { type: 'button', id: 'test', text: 'Test', img: 'icon-play-game-windowed' },
            { type: 'button', id: 'test-debug', text: 'Test And Debug...', img: 'icon-play-game-windowed' },
            { type: 'break' },
            { type: 'button', id: 'position', text: '', img: 'icon-position', checked: false },
            { type: 'button', id: 'rotation', text: '', img: 'icon-rotation', checked: false },
            { type: 'button', id: 'scaling', text: '', img: 'icon-scaling', checked: false }
        ];
        this.tools.onClick = target => this.onToolsClick(target);
        this.tools.build('TOOLS-TOOLBAR');
    }

    /**
     * Sets a click and the given item's id
     * @param id the id of the item to click
     */
    public setToolClicked (id: string): void {
        this.onToolsClick(id);
    }

    /**
     * Once the user clicks on a menu of the main toolbar
     * @param target the target element
     */
    protected async onMainClick (target: string): Promise<void> {
        switch (target) {
            // Project
            case 'project:import-project':
                SceneImporter.ImportProject(this.editor);
                break;
            case 'project:reload-project':
                Dialog.Create('Reload scene', 'Are you sure to reload the entire scene?', (result) => {
                    if (result === 'No')
                        return;
                    
                    this.editor._showReloadDialog = false;
                    this.editor.filesInput['_processReload']();
                });
                break
            case 'project:download-project':
                SceneExporter.DownloadBabylonFile(this.editor);
                break;
            case 'project:clean-project':
                await this.editor.createDefaultScene(true);
                break;
            case 'project:export-project':
                await SceneExporter.ExportProject(this.editor);
                break;
            case 'project:export-template':
                await SceneExporter.ExportTemplate(this.editor);
                break;
            case 'project:serialize-scene':
                new SceneSerializer(this.editor.core.scene);
                break;

            // Edit
            case 'edit:undo':
                UndoRedo.Undo();
                break;
            case 'edit:redo':
                UndoRedo.Redo();
                break;
            case 'edit:clean-materials':
                Window.CreateAlert(`Cleared ${SceneManager.CleanUnusedMaterials(this.editor.core.scene)} materials`, 'Report');
                break;
            case 'edit:clean-textures':
                Window.CreateAlert(`Cleared ${SceneManager.CleanUnusedTextures(this.editor.core.scene)} textures`, 'Report');
                break;

            // View
            case 'view:animations':
                await this.loadTool('animation-editor', 'Animations Editor');
                break;
            case 'view:textures':
                await this.loadTool('texture-viewer', 'Textures Viewer');
                break;
            case 'view:materials':
                await this.loadTool('material-viewer', 'Materials Viewer');
                break;
            case 'view:code':
                await this.loadTool('behavior-editor', 'Behavior Code');
                break;
            case 'view:material-creator':
                await this.loadTool('material-creator', 'Material Creator');
                break;
            case 'view:post-process-creator':
                await this.loadTool('post-process-creator', 'Post-Process Creator');
                break;
            case 'view:particles-creator':
                await this.loadTool('particles-creator', 'Particles Creator');
                break;
            case 'view:path-finder':
                await this.loadTool('path-finder', 'Path Finder');
                break;

            // Add
            case 'add:particle-system':
                SceneFactory.CreateDefaultParticleSystem(this.editor, false);
                break;
            case 'add:particle-system-animated':
                SceneFactory.CreateDefaultParticleSystem(this.editor, true);
                break;
            case 'add:sky':
                SceneFactory.CreateSkyEffect(this.editor);
                break;
            case 'add:water':
                SceneFactory.CreateWaterEffect(this.editor);
                break;
            
            case 'add:ground':
                SceneFactory.CreateGroundMesh(this.editor);
                break;
            case 'add:cube':
                SceneFactory.CreateCube(this.editor);
                break;
            case 'add:sphere':
                SceneFactory.CreateSphere(this.editor);
                break;


            case 'add:point-light':
                SceneFactory.CreateLight(this.editor, 'point');
                break;
            case 'add:directional-light':
                SceneFactory.CreateLight(this.editor, 'directional');
                break;
            case 'add:spot-light':
                SceneFactory.CreateLight(this.editor, 'spot');
                break;
            case 'add:hemispheric-light':
                SceneFactory.CreateLight(this.editor, 'hemispheric');
                break;
            
            case 'add:sound':
                SceneFactory.AddSound(this.editor);
                break;

            case 'gui:add-advanced-texture':
                SceneFactory.AddGui(this.editor);
                break;
            case 'gui:add-image':
                SceneFactory.AddGuiImage(this.editor);
                break;

            default: break;
        }
    }

    /**
     * Once the user clicks on a menu of the tools toolbar
     * @param target the target element
     */
    protected onToolsClick (target: string): void {
        switch (target) {
            // Play and text
            case 'play':
                const animatables = SceneManager.GetAnimatables(this.editor.core.scene);
                this.tools.isChecked('play', true) ? SceneManager.PlayAllAnimatables(this.editor.core.scene, animatables) : this.editor.core.scene.stopAllAnimations();
                break;
            case 'test':
                SceneExporter.CreateFiles(this.editor);
                this.editor.addEditPanelPlugin('play-game', true, 'Game');
                break;
            case 'test-debug':
                SceneExporter.CreateFiles(this.editor);
                Tools.OpenPopup('./preview.html', 'Preview', 1280, 800);
                break;

            // Gizmos
            case 'position':
            case 'rotation':
            case 'scaling':
                const active = this.tools.isChecked(target, true);

                this.tools.setChecked('position', false);
                this.tools.setChecked('rotation', false);
                this.tools.setChecked('scaling', false);
                this.tools.setChecked(target, active);

                this.editor.scenePicker.gizmosLayer.shouldRender = active;

                if (!active) {
                    this.editor.scenePicker.gizmoType = GizmoType.NONE;
                    break;
                }

                switch (target) {
                    case 'position': this.editor.scenePicker.gizmoType = GizmoType.POSITION; break;
                    case 'rotation': this.editor.scenePicker.gizmoType = GizmoType.ROTATION; break;
                    case 'scaling': this.editor.scenePicker.gizmoType = GizmoType.SCALING; break;
                    default: break; // Should never happen
                }

                break;
            default: break;
        }
    }

    /**
     * Loads an editor tool and add it in the edit-panel
     * @param url the URL of the tool
     * @param name: the name of the tool to draw when locking the panel
     */
    protected async loadTool (url: string, name: string): Promise<IEditorPlugin> {
        const result = await this.editor.addEditPanelPlugin(url, false, name);
        return result;
    }
}