// Wall-E Robot 3D with Babylon.js
const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

// Create the scene
const createScene = () => {
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0.5, 0.7, 0.9);

    // Camera
    const camera = new BABYLON.ArcRotateCamera(
        "camera",
        Math.PI / 2,
        Math.PI / 3,
        15,
        new BABYLON.Vector3(0, 2, 0),
        scene
    );
    camera.attachControl(canvas, true);
    camera.lowerRadiusLimit = 8;
    camera.upperRadiusLimit = 30;

    // Lights
    const light1 = new BABYLON.HemisphericLight(
        "light1",
        new BABYLON.Vector3(0, 1, 0),
        scene
    );
    light1.intensity = 0.7;

    const light2 = new BABYLON.DirectionalLight(
        "light2",
        new BABYLON.Vector3(-1, -2, -1),
        scene
    );
    light2.intensity = 0.5;

    // Ground with grid pattern
    const ground = BABYLON.MeshBuilder.CreateGround(
        "ground",
        { width: 50, height: 50 },
        scene
    );
    
    const gridMaterial = new BABYLON.GridMaterial("gridMat", scene);
    gridMaterial.gridRatio = 2;
    gridMaterial.majorUnitFrequency = 5;
    gridMaterial.minorUnitVisibility = 0.3;
    gridMaterial.mainColor = new BABYLON.Color3(0.3, 0.5, 0.3);
    gridMaterial.lineColor = new BABYLON.Color3(0.2, 0.4, 0.2);
    ground.material = gridMaterial;

    // Create Wall-E style robot
    const robot = createRobot(scene);

    return { scene, robot, camera };
};

// Create the Wall-E robot
const createRobot = (scene) => {
    const robot = new BABYLON.TransformNode("robot", scene);

    // Body (main box) - more compact and Wall-E proportioned
    const body = BABYLON.MeshBuilder.CreateBox(
        "body",
        { width: 2.2, height: 1.8, depth: 1.6 },
        scene
    );
    body.position.y = 1.2;
    body.parent = robot;

    const bodyMaterial = new BABYLON.StandardMaterial("bodyMat", scene);
    bodyMaterial.diffuseColor = new BABYLON.Color3(0.85, 0.75, 0.25);
    bodyMaterial.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    bodyMaterial.ambientColor = new BABYLON.Color3(0.3, 0.3, 0.1);
    body.material = bodyMaterial;

    // Head/Eyes housing - more Wall-E style with binocular shape
    const head = BABYLON.MeshBuilder.CreateBox(
        "head",
        { width: 1.6, height: 0.7, depth: 0.9 },
        scene
    );
    head.position = new BABYLON.Vector3(0, 1.1, 0.5);
    head.parent = body;

    const headMaterial = new BABYLON.StandardMaterial("headMat", scene);
    headMaterial.diffuseColor = new BABYLON.Color3(0.8, 0.7, 0.2);
    headMaterial.ambientColor = new BABYLON.Color3(0.3, 0.3, 0.1);
    head.material = headMaterial;

    // Neck/Connector
    const neck = BABYLON.MeshBuilder.CreateCylinder(
        "neck",
        { height: 0.3, diameter: 0.5 },
        scene
    );
    neck.position = new BABYLON.Vector3(0, 0.65, 0.3);
    neck.parent = body;
    neck.material = bodyMaterial;

    // Eyes - Wall-E's iconic binocular eyes
    const createEye = (x) => {
        const eyeBase = new BABYLON.TransformNode("eyeBase", scene);
        eyeBase.parent = head;
        
        // Eye cylinder (the lens housing)
        const eye = BABYLON.MeshBuilder.CreateCylinder(
            "eye",
            { height: 0.5, diameter: 0.5 },
            scene
        );
        eye.rotation.z = Math.PI / 2;
        eye.position = new BABYLON.Vector3(x, 0.1, 0.55);
        eye.parent = eyeBase;

        const eyeMaterial = new BABYLON.StandardMaterial("eyeMat", scene);
        eyeMaterial.diffuseColor = new BABYLON.Color3(0.15, 0.15, 0.15);
        eyeMaterial.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        eye.material = eyeMaterial;
        
        // Eye lens (the glowing part)
        const lens = BABYLON.MeshBuilder.CreateCylinder(
            "lens",
            { height: 0.1, diameter: 0.4 },
            scene
        );
        lens.rotation.z = Math.PI / 2;
        lens.position = new BABYLON.Vector3(x, 0.1, 0.8);
        lens.parent = eyeBase;

        const lensMaterial = new BABYLON.StandardMaterial("lensMat", scene);
        lensMaterial.diffuseColor = new BABYLON.Color3(0.3, 0.5, 0.9);
        lensMaterial.emissiveColor = new BABYLON.Color3(0.25, 0.45, 0.85);
        lensMaterial.specularColor = new BABYLON.Color3(0.8, 0.8, 1);
        lens.material = lensMaterial;

        return eyeBase;
    };

    const leftEye = createEye(-0.4);
    const rightEye = createEye(0.4);

    // Tracks instead of legs - Wall-E style treads
    const createTrack = (x) => {
        const track = new BABYLON.TransformNode("track", scene);
        track.parent = body;
        
        // Track body (main tread housing)
        const trackBody = BABYLON.MeshBuilder.CreateBox(
            "trackBody",
            { width: 0.6, height: 0.8, depth: 2.2 },
            scene
        );
        trackBody.position = new BABYLON.Vector3(x, -0.7, 0);
        trackBody.parent = track;
        
        const trackMaterial = new BABYLON.StandardMaterial("trackMat", scene);
        trackMaterial.diffuseColor = new BABYLON.Color3(0.25, 0.25, 0.25);
        trackMaterial.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);
        trackBody.material = trackMaterial;
        
        // Track wheels (visible on sides)
        const createWheel = (z) => {
            const wheel = BABYLON.MeshBuilder.CreateCylinder(
                "wheel",
                { height: 0.7, diameter: 0.6 },
                scene
            );
            wheel.rotation.z = Math.PI / 2;
            wheel.position = new BABYLON.Vector3(x, -0.7, z);
            wheel.parent = track;
            
            const wheelMaterial = new BABYLON.StandardMaterial("wheelMat", scene);
            wheelMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
            wheel.material = wheelMaterial;
            
            return wheel;
        };
        
        const frontWheel = createWheel(0.8);
        const backWheel = createWheel(-0.8);
        
        // Tread detail (top and bottom plates)
        const treadTop = BABYLON.MeshBuilder.CreateBox(
            "treadTop",
            { width: 0.7, height: 0.15, depth: 2.4 },
            scene
        );
        treadTop.position = new BABYLON.Vector3(x, -0.3, 0);
        treadTop.parent = track;
        treadTop.material = trackMaterial;
        
        const treadBottom = BABYLON.MeshBuilder.CreateBox(
            "treadBottom",
            { width: 0.7, height: 0.15, depth: 2.4 },
            scene
        );
        treadBottom.position = new BABYLON.Vector3(x, -1.1, 0);
        treadBottom.parent = track;
        treadBottom.material = trackMaterial;
        
        track.wheels = [frontWheel, backWheel];
        
        return track;
    };

    // Create tracks (Wall-E's signature treads)
    const tracks = [];
    tracks.push(createTrack(-1.1));  // Left track
    tracks.push(createTrack(1.1));   // Right track

    // Hatch (compuerta) - front panel that opens
    const hatch = BABYLON.MeshBuilder.CreateBox(
        "hatch",
        { width: 1.7, height: 1.4, depth: 0.15 },
        scene
    );
    hatch.position = new BABYLON.Vector3(0, -0.2, 0.8);
    hatch.setPivotPoint(new BABYLON.Vector3(0, -0.7, 0));
    hatch.parent = body;

    const hatchMaterial = new BABYLON.StandardMaterial("hatchMat", scene);
    hatchMaterial.diffuseColor = new BABYLON.Color3(0.65, 0.55, 0.2);
    hatchMaterial.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    hatchMaterial.ambientColor = new BABYLON.Color3(0.25, 0.25, 0.1);
    hatch.material = hatchMaterial;

    // Arms - Wall-E's simple arms
    const createArm = (x) => {
        const armGroup = new BABYLON.TransformNode("armGroup", scene);
        armGroup.parent = body;
        
        // Upper arm
        const upperArm = BABYLON.MeshBuilder.CreateBox(
            "upperArm",
            { width: 0.25, height: 0.6, depth: 0.25 },
            scene
        );
        upperArm.position = new BABYLON.Vector3(x, 0.1, 0);
        upperArm.parent = armGroup;

        // Lower arm
        const lowerArm = BABYLON.MeshBuilder.CreateBox(
            "lowerArm",
            { width: 0.2, height: 0.5, depth: 0.2 },
            scene
        );
        lowerArm.position = new BABYLON.Vector3(x, -0.35, 0.2);
        lowerArm.parent = armGroup;
        
        // Hand/Gripper
        const hand = BABYLON.MeshBuilder.CreateBox(
            "hand",
            { width: 0.3, height: 0.15, depth: 0.3 },
            scene
        );
        hand.position = new BABYLON.Vector3(x, -0.65, 0.3);
        hand.parent = armGroup;

        const armMaterial = new BABYLON.StandardMaterial("armMat", scene);
        armMaterial.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        armMaterial.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);
        upperArm.material = armMaterial;
        lowerArm.material = armMaterial;
        hand.material = armMaterial;

        return armGroup;
    };

    const leftArm = createArm(-1.2);
    const rightArm = createArm(1.2);

    robot.position.y = 0.3;

    // Store references
    robot.body = body;
    robot.head = head;
    robot.neck = neck;
    robot.hatch = hatch;
    robot.tracks = tracks;
    robot.leftEye = leftEye;
    robot.rightEye = rightEye;

    return robot;
};

// Animation and control system
class RobotController {
    constructor(robot, scene) {
        this.robot = robot;
        this.scene = scene;
        this.moveSpeed = 0.1;
        this.rotateSpeed = 0.05;
        this.hatchOpen = false;
        this.isCube = false;
        this.cubeTransition = 0;
        this.walkCycle = 0; // For leg animation
        
        this.keys = {};
        this.touchControls = {
            moveForward: false,
            moveBackward: false,
            moveLeft: false,
            moveRight: false,
            rotateLeft: false,
            rotateRight: false
        };
        this.setupControls();
        this.setupTouchControls();
    }

    setupControls() {
        window.addEventListener("keydown", (e) => {
            this.keys[e.key.toLowerCase()] = true;

            if (e.key === " ") {
                e.preventDefault();
                this.toggleHatch();
            }
            if (e.key.toLowerCase() === "c") {
                this.toggleCube();
            }
        });

        window.addEventListener("keyup", (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }

    setupTouchControls() {
        // Create touch control overlay
        const touchContainer = document.createElement('div');
        touchContainer.id = 'touchControls';
        touchContainer.style.cssText = `
            position: absolute;
            bottom: 20px;
            width: 100%;
            display: block;
            pointer-events: none;
            z-index: 1000;
        `;
        
        // Movement controls (left side)
        const movementControls = document.createElement('div');
        movementControls.style.cssText = `
            position: absolute;
            left: 20px;
            bottom: 0;
            pointer-events: auto;
        `;
        
        const createTouchButton = (label, top, left, size = 60) => {
            const btn = document.createElement('button');
            btn.textContent = label;
            btn.style.cssText = `
                position: absolute;
                top: ${top}px;
                left: ${left}px;
                width: ${size}px;
                height: ${size}px;
                background: rgba(76, 175, 80, 0.6);
                border: 3px solid rgba(76, 175, 80, 0.9);
                border-radius: 50%;
                color: white;
                font-size: 22px;
                font-weight: bold;
                touch-action: none;
                user-select: none;
                cursor: pointer;
                transition: all 0.2s ease;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            `;
            
            // Add hover effect
            btn.addEventListener('mouseenter', () => {
                btn.style.background = 'rgba(76, 175, 80, 0.8)';
                btn.style.transform = 'scale(1.05)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.background = 'rgba(76, 175, 80, 0.6)';
                btn.style.transform = 'scale(1)';
            });
            
            return btn;
        };
        
        const upBtn = createTouchButton('↑', 0, 65, 65);
        const downBtn = createTouchButton('↓', 130, 65, 65);
        const leftBtn = createTouchButton('←', 65, 0, 65);
        const rightBtn = createTouchButton('→', 65, 130, 65);
        
        movementControls.appendChild(upBtn);
        movementControls.appendChild(downBtn);
        movementControls.appendChild(leftBtn);
        movementControls.appendChild(rightBtn);
        
        // Rotation controls (right side)
        const rotationControls = document.createElement('div');
        rotationControls.style.cssText = `
            position: absolute;
            right: 20px;
            bottom: 0;
            pointer-events: auto;
        `;
        
        const rotLeftBtn = createTouchButton('⟲', 35, 0, 65);
        const rotRightBtn = createTouchButton('⟳', 35, 85, 65);
        
        rotationControls.appendChild(rotLeftBtn);
        rotationControls.appendChild(rotRightBtn);
        
        // Action buttons (right side, middle)
        const actionControls = document.createElement('div');
        actionControls.style.cssText = `
            position: absolute;
            right: 20px;
            bottom: 220px;
            pointer-events: auto;
        `;
        
        const hatchBtn = createTouchButton('🚪', 0, 42.5, 65);
        hatchBtn.title = 'Abrir/Cerrar compuerta';
        const cubeBtn = createTouchButton('◻', 80, 42.5, 65);
        cubeBtn.title = 'Transformar a cubo';
        
        actionControls.appendChild(hatchBtn);
        actionControls.appendChild(cubeBtn);
        
        touchContainer.appendChild(movementControls);
        touchContainer.appendChild(rotationControls);
        touchContainer.appendChild(actionControls);
        document.body.appendChild(touchContainer);
        
        // Always show touch controls
        touchContainer.style.display = 'block';
        
        // Touch and mouse event handlers
        const addTouchHandler = (btn, action) => {
            // Touch events
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.touchControls[action] = true;
                btn.style.background = 'rgba(76, 175, 80, 1)';
                btn.style.transform = 'scale(0.95)';
            });
            
            const resetTouch = (e) => {
                e.preventDefault();
                this.touchControls[action] = false;
                btn.style.background = 'rgba(76, 175, 80, 0.6)';
                btn.style.transform = 'scale(1)';
            };
            
            btn.addEventListener('touchend', resetTouch);
            btn.addEventListener('touchcancel', resetTouch);
            
            // Mouse events (for desktop)
            btn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.touchControls[action] = true;
                btn.style.background = 'rgba(76, 175, 80, 1)';
                btn.style.transform = 'scale(0.95)';
            });
            
            const resetMouse = (e) => {
                e.preventDefault();
                this.touchControls[action] = false;
                btn.style.background = 'rgba(76, 175, 80, 0.6)';
                btn.style.transform = 'scale(1)';
            };
            
            btn.addEventListener('mouseup', resetMouse);
            btn.addEventListener('mouseleave', resetMouse);
        };
        
        addTouchHandler(upBtn, 'moveForward');
        addTouchHandler(downBtn, 'moveBackward');
        addTouchHandler(leftBtn, 'moveLeft');
        addTouchHandler(rightBtn, 'moveRight');
        addTouchHandler(rotLeftBtn, 'rotateLeft');
        addTouchHandler(rotRightBtn, 'rotateRight');
        
        // Action buttons
        const addActionHandler = (btn, callback) => {
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                callback();
                btn.style.transform = 'scale(0.9)';
                setTimeout(() => btn.style.transform = 'scale(1)', 200);
            });
            
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                callback();
                btn.style.transform = 'scale(0.9)';
                setTimeout(() => btn.style.transform = 'scale(1)', 200);
            });
        };
        
        addActionHandler(hatchBtn, () => this.toggleHatch());
        addActionHandler(cubeBtn, () => this.toggleCube());
    }

    toggleHatch() {
        this.hatchOpen = !this.hatchOpen;
        const targetRotation = this.hatchOpen ? Math.PI / 2.5 : 0;
        
        const animationHatch = new BABYLON.Animation(
            "hatchAnimation",
            "rotation.x",
            30,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );

        const keys = [
            { frame: 0, value: this.robot.hatch.rotation.x },
            { frame: 30, value: targetRotation }
        ];

        animationHatch.setKeys(keys);
        this.robot.hatch.animations = [animationHatch];
        this.scene.beginAnimation(this.robot.hatch, 0, 30, false);
    }

    toggleCube() {
        this.isCube = !this.isCube;
        const duration = 60;

        if (this.isCube) {
            // Transform to cube
            this.animateToCube(duration);
        } else {
            // Transform back to robot
            this.animateToRobot(duration);
        }
    }

    animateToCube(duration) {
        // Animate body to cube shape
        const bodyScaleAnim = new BABYLON.Animation(
            "bodyScale",
            "scaling",
            30,
            BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );

        const bodyKeys = [
            { frame: 0, value: new BABYLON.Vector3(1, 1, 1) },
            { frame: duration, value: new BABYLON.Vector3(1.2, 1.5, 1.3) }
        ];

        bodyScaleAnim.setKeys(bodyKeys);
        this.robot.body.animations = [bodyScaleAnim];
        this.scene.beginAnimation(this.robot.body, 0, duration, false);

        // Hide head
        const headScaleAnim = new BABYLON.Animation(
            "headScale",
            "scaling",
            30,
            BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );

        const headKeys = [
            { frame: 0, value: new BABYLON.Vector3(1, 1, 1) },
            { frame: duration, value: new BABYLON.Vector3(0.01, 0.01, 0.01) }
        ];

        headScaleAnim.setKeys(headKeys);
        this.robot.head.animations = [headScaleAnim];
        this.scene.beginAnimation(this.robot.head, 0, duration, false);

        // Compact hatch
        const hatchScaleAnim = new BABYLON.Animation(
            "hatchScale",
            "scaling",
            30,
            BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );

        const hatchKeys = [
            { frame: 0, value: new BABYLON.Vector3(1, 1, 1) },
            { frame: duration, value: new BABYLON.Vector3(0.01, 0.01, 0.01) }
        ];

        hatchScaleAnim.setKeys(hatchKeys);
        this.robot.hatch.animations = [hatchScaleAnim];
        this.scene.beginAnimation(this.robot.hatch, 0, duration, false);
    }

    animateToRobot(duration) {
        // Restore body to normal
        const bodyScaleAnim = new BABYLON.Animation(
            "bodyScale",
            "scaling",
            30,
            BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );

        const bodyKeys = [
            { frame: 0, value: this.robot.body.scaling.clone() },
            { frame: duration, value: new BABYLON.Vector3(1, 1, 1) }
        ];

        bodyScaleAnim.setKeys(bodyKeys);
        this.robot.body.animations = [bodyScaleAnim];
        this.scene.beginAnimation(this.robot.body, 0, duration, false);

        // Show head
        const headScaleAnim = new BABYLON.Animation(
            "headScale",
            "scaling",
            30,
            BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );

        const headKeys = [
            { frame: 0, value: this.robot.head.scaling.clone() },
            { frame: duration, value: new BABYLON.Vector3(1, 1, 1) }
        ];

        headScaleAnim.setKeys(headKeys);
        this.robot.head.animations = [headScaleAnim];
        this.scene.beginAnimation(this.robot.head, 0, duration, false);

        // Restore hatch
        const hatchScaleAnim = new BABYLON.Animation(
            "hatchScale",
            "scaling",
            30,
            BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );

        const hatchKeys = [
            { frame: 0, value: this.robot.hatch.scaling.clone() },
            { frame: duration, value: new BABYLON.Vector3(1, 1, 1) }
        ];

        hatchScaleAnim.setKeys(hatchKeys);
        this.robot.hatch.animations = [hatchScaleAnim];
        this.scene.beginAnimation(this.robot.hatch, 0, duration, false);
    }

    update() {
        // Calculate forward direction vector
        const getForwardVector = () => new BABYLON.Vector3(
            Math.sin(this.robot.rotation.y),
            0,
            Math.cos(this.robot.rotation.y)
        );

        let isMoving = false;

        // Movement (keyboard or touch)
        if (this.keys["w"] || this.touchControls.moveForward) {
            const forward = getForwardVector();
            this.robot.position.addInPlace(forward.scale(this.moveSpeed));
            isMoving = true;
        }
        if (this.keys["s"] || this.touchControls.moveBackward) {
            const backward = getForwardVector();
            this.robot.position.addInPlace(backward.scale(-this.moveSpeed));
            isMoving = true;
        }
        if (this.keys["a"] || this.touchControls.moveLeft) {
            const left = new BABYLON.Vector3(
                Math.sin(this.robot.rotation.y - Math.PI / 2),
                0,
                Math.cos(this.robot.rotation.y - Math.PI / 2)
            );
            this.robot.position.addInPlace(left.scale(this.moveSpeed));
            isMoving = true;
        }
        if (this.keys["d"] || this.touchControls.moveRight) {
            const right = new BABYLON.Vector3(
                Math.sin(this.robot.rotation.y + Math.PI / 2),
                0,
                Math.cos(this.robot.rotation.y + Math.PI / 2)
            );
            this.robot.position.addInPlace(right.scale(this.moveSpeed));
            isMoving = true;
        }

        // Rotation (keyboard or touch)
        if (this.keys["q"] || this.touchControls.rotateLeft) {
            this.robot.rotation.y += this.rotateSpeed;
        }
        if (this.keys["e"] || this.touchControls.rotateRight) {
            this.robot.rotation.y -= this.rotateSpeed;
        }

        // Animate tracks when moving
        if (isMoving) {
            this.animateTracks();
        }

        // Keep robot on ground
        if (this.robot.position.y < 0.3) {
            this.robot.position.y = 0.3;
        }
    }

    animateTracks() {
        // Rotate track wheels to simulate movement
        this.walkCycle += 0.15;
        
        if (this.robot.tracks && this.robot.tracks.length > 0) {
            this.robot.tracks.forEach((track) => {
                if (track.wheels) {
                    track.wheels.forEach((wheel) => {
                        wheel.rotation.x = this.walkCycle;
                    });
                }
            });
        }
    }
}

// Initialize the scene
const { scene, robot, camera } = createScene();
const controller = new RobotController(robot, scene);

// Render loop
engine.runRenderLoop(() => {
    controller.update();
    scene.render();
});

// Resize handler
window.addEventListener("resize", () => {
    engine.resize();
});
