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
        
        // Component configuration constants
        this.JUMP_HEIGHT = 3;
        this.JUMP_DURATION = 60;
        this.FLY_HEIGHT = 5;
        this.EVENT_MOVE_DISTANCE = 2;
        
        // Component system (Unity Inspector style)
        this.components = {
            jump: false,
            lights: false,
            fly: false
        };
        
        this.isJumping = false;
        this.isFlying = false;
        this.flyHeight = 0;
        this.lightsEnabled = false;
        this.robotLights = null;
        
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
    
    // Component methods
    jump() {
        if (!this.components.jump || this.isJumping) return;
        
        this.isJumping = true;
        const startY = this.robot.position.y;
        const jumpHeight = this.JUMP_HEIGHT;
        const jumpDuration = this.JUMP_DURATION;
        
        const jumpAnim = new BABYLON.Animation(
            "jumpAnimation",
            "position.y",
            30,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );
        
        const keys = [
            { frame: 0, value: startY },
            { frame: jumpDuration / 2, value: startY + jumpHeight },
            { frame: jumpDuration, value: startY }
        ];
        
        jumpAnim.setKeys(keys);
        this.robot.animations = [jumpAnim];
        this.scene.beginAnimation(this.robot, 0, jumpDuration, false, 1, () => {
            this.isJumping = false;
        });
    }
    
    toggleLights() {
        if (!this.components.lights) return;
        
        this.lightsEnabled = !this.lightsEnabled;
        
        if (this.lightsEnabled) {
            // Create lights on robot
            if (!this.robotLights) {
                this.robotLights = new BABYLON.PointLight(
                    "robotLight",
                    new BABYLON.Vector3(0, 2, 0),
                    this.scene
                );
                this.robotLights.parent = this.robot;
                this.robotLights.diffuse = new BABYLON.Color3(1, 1, 0);
                this.robotLights.specular = new BABYLON.Color3(1, 1, 0);
                this.robotLights.intensity = 2;
            }
            this.robotLights.setEnabled(true);
            
            // Add glow to eyes
            if (this.robot.leftEye && this.robot.rightEye) {
                const leftLens = this.robot.leftEye.getChildMeshes().find(m => m.name === "lens");
                const rightLens = this.robot.rightEye.getChildMeshes().find(m => m.name === "lens");
                if (leftLens && leftLens.material) {
                    leftLens.material.emissiveColor = new BABYLON.Color3(1, 1, 0);
                }
                if (rightLens && rightLens.material) {
                    rightLens.material.emissiveColor = new BABYLON.Color3(1, 1, 0);
                }
            }
        } else {
            if (this.robotLights) {
                this.robotLights.setEnabled(false);
            }
            
            // Reset eye color
            if (this.robot.leftEye && this.robot.rightEye) {
                const leftLens = this.robot.leftEye.getChildMeshes().find(m => m.name === "lens");
                const rightLens = this.robot.rightEye.getChildMeshes().find(m => m.name === "lens");
                if (leftLens && leftLens.material) {
                    leftLens.material.emissiveColor = new BABYLON.Color3(0.25, 0.45, 0.85);
                }
                if (rightLens && rightLens.material) {
                    rightLens.material.emissiveColor = new BABYLON.Color3(0.25, 0.45, 0.85);
                }
            }
        }
    }
    
    toggleFly() {
        if (!this.components.fly) return;
        
        this.isFlying = !this.isFlying;
        
        if (this.isFlying) {
            this.flyHeight = this.FLY_HEIGHT;
            const flyAnim = new BABYLON.Animation(
                "flyAnimation",
                "position.y",
                30,
                BABYLON.Animation.ANIMATIONTYPE_FLOAT,
                BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
            );
            
            const keys = [
                { frame: 0, value: this.robot.position.y },
                { frame: 30, value: this.flyHeight }
            ];
            
            flyAnim.setKeys(keys);
            this.robot.animations = [flyAnim];
            this.scene.beginAnimation(this.robot, 0, 30, false);
        } else {
            const landAnim = new BABYLON.Animation(
                "landAnimation",
                "position.y",
                30,
                BABYLON.Animation.ANIMATIONTYPE_FLOAT,
                BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
            );
            
            const keys = [
                { frame: 0, value: this.robot.position.y },
                { frame: 30, value: 0.3 }
            ];
            
            landAnim.setKeys(keys);
            this.robot.animations = [landAnim];
            this.scene.beginAnimation(this.robot, 0, 30, false);
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

// ============================================
// BLOCKLY INTEGRATION
// ============================================

// Wait for Blockly to load
let blocklyWorkspace = null;
let blocklyInitialized = false;

function initializeBlockly() {
    if (blocklyInitialized || typeof Blockly === 'undefined') {
        return;
    }
    
    blocklyInitialized = true;
    
    // Define custom blocks for robot control
    Blockly.Blocks['robot_move_forward'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("🤖 Mover adelante")
                .appendField(new Blockly.FieldNumber(1, 0.1, 10, 0.1), "DISTANCE")
                .appendField("unidades");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(120);
            this.setTooltip("Mueve el robot hacia adelante");
        }
    };
    
    Blockly.Blocks['robot_move_backward'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("🤖 Mover atrás")
                .appendField(new Blockly.FieldNumber(1, 0.1, 10, 0.1), "DISTANCE")
                .appendField("unidades");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(120);
            this.setTooltip("Mueve el robot hacia atrás");
        }
    };
    
    Blockly.Blocks['robot_rotate_left'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("↶ Girar izquierda")
                .appendField(new Blockly.FieldAngle(90), "ANGLE")
                .appendField("grados");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip("Gira el robot a la izquierda");
        }
    };
    
    Blockly.Blocks['robot_rotate_right'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("↷ Girar derecha")
                .appendField(new Blockly.FieldAngle(90), "ANGLE")
                .appendField("grados");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip("Gira el robot a la derecha");
        }
    };
    
    Blockly.Blocks['robot_toggle_hatch'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("🚪 Abrir/Cerrar compuerta");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(300);
            this.setTooltip("Abre o cierra la compuerta del robot");
        }
    };
    
    Blockly.Blocks['robot_transform'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("◻ Transformar robot");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(300);
            this.setTooltip("Transforma el robot en cubo o viceversa");
        }
    };
    
    Blockly.Blocks['robot_wait'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("⏱️ Esperar")
                .appendField(new Blockly.FieldNumber(1, 0.1, 10, 0.1), "SECONDS")
                .appendField("segundos");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(160);
            this.setTooltip("Espera un tiempo antes de continuar");
        }
    };
    
    // Component blocks
    Blockly.Blocks['robot_jump'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("🦘 Saltar");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(60);
            this.setTooltip("Hace que el robot salte (requiere componente Saltar)");
        }
    };
    
    Blockly.Blocks['robot_toggle_lights'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("💡 Encender/Apagar Luces");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(45);
            this.setTooltip("Enciende o apaga las luces del robot (requiere componente Luces)");
        }
    };
    
    Blockly.Blocks['robot_toggle_fly'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("✈️ Volar/Aterrizar");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(200);
            this.setTooltip("Hace que el robot vuele o aterrice (requiere componente Volar)");
        }
    };
    
    // Event blocks
    // Main program start block (hat block - no previous statement)
    Blockly.Blocks['robot_when_start'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("🚀 Cuando se inicie el programa");
            this.appendStatementInput("DO")
                .appendField("hacer");
            this.setColour(290);
            this.setTooltip("Bloque de inicio del programa. Arrastra bloques aquí para ejecutarlos.");
            // NO setPreviousStatement - this is a "hat" block that starts the program
        }
    };
    
    // Event blocks (while-running events)
    Blockly.Blocks['robot_on_move'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("🏃 Mientras se mueve");
            this.appendStatementInput("DO")
                .appendField("hacer");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(290);
            this.setTooltip("Ejecuta acciones mientras el robot está en movimiento");
        }
    };
    
    Blockly.Blocks['robot_repeat_while_moving'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("🔁 Repetir mientras avanza")
                .appendField(new Blockly.FieldNumber(3, 1, 10, 1), "TIMES")
                .appendField("veces");
            this.appendStatementInput("DO")
                .appendField("hacer");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(290);
            this.setTooltip("Repite acciones mientras el robot se mueve adelante");
        }
    };
    
    // Code generators
    Blockly.JavaScript['robot_move_forward'] = function(block) {
        const distance = block.getFieldValue('DISTANCE');
        return `await moveForward(${distance});\n`;
    };
    
    Blockly.JavaScript['robot_move_backward'] = function(block) {
        const distance = block.getFieldValue('DISTANCE');
        return `await moveBackward(${distance});\n`;
    };
    
    Blockly.JavaScript['robot_rotate_left'] = function(block) {
        const angle = block.getFieldValue('ANGLE');
        return `await rotateLeft(${angle});\n`;
    };
    
    Blockly.JavaScript['robot_rotate_right'] = function(block) {
        const angle = block.getFieldValue('ANGLE');
        return `await rotateRight(${angle});\n`;
    };
    
    Blockly.JavaScript['robot_toggle_hatch'] = function(block) {
        return `await toggleHatch();\n`;
    };
    
    Blockly.JavaScript['robot_transform'] = function(block) {
        return `await transformRobot();\n`;
    };
    
    Blockly.JavaScript['robot_wait'] = function(block) {
        const seconds = block.getFieldValue('SECONDS');
        return `await wait(${seconds});\n`;
    };
    
    // Component code generators
    Blockly.JavaScript['robot_jump'] = function(block) {
        return `await jumpRobot();\n`;
    };
    
    Blockly.JavaScript['robot_toggle_lights'] = function(block) {
        return `await toggleLights();\n`;
    };
    
    Blockly.JavaScript['robot_toggle_fly'] = function(block) {
        return `await toggleFly();\n`;
    };
    
    // Event code generators
    Blockly.JavaScript['robot_when_start'] = function(block) {
        const statements = Blockly.JavaScript.statementToCode(block, 'DO');
        return statements; // Top-level block just returns its contents
    };
    
    Blockly.JavaScript['robot_on_move'] = function(block) {
        const statements = Blockly.JavaScript.statementToCode(block, 'DO');
        return `await executeWhileMoving(async () => {\n${statements}});\n`;
    };
    
    Blockly.JavaScript['robot_repeat_while_moving'] = function(block) {
        const times = block.getFieldValue('TIMES');
        const statements = Blockly.JavaScript.statementToCode(block, 'DO');
        return `await repeatWhileMoving(${times}, async () => {\n${statements}});\n`;
    };
    
    // Register generators with forBlock for Blockly 12+ compatibility
    // Copy all robot_* generators from the old API to the new API
    Object.keys(Blockly.JavaScript).forEach(key => {
        if (key.startsWith('robot_') && typeof Blockly.JavaScript[key] === 'function') {
            Blockly.JavaScript.forBlock[key] = Blockly.JavaScript[key];
        }
    });
    
    // Create Blockly workspace
    blocklyWorkspace = Blockly.inject('blocklyDiv', {
        toolbox: {
            kind: 'categoryToolbox',
            contents: [
                {
                    kind: 'category',
                    name: 'Movimiento',
                    colour: '120',
                    contents: [
                        { kind: 'block', type: 'robot_move_forward' },
                        { kind: 'block', type: 'robot_move_backward' },
                    ]
                },
                {
                    kind: 'category',
                    name: 'Rotación',
                    colour: '230',
                    contents: [
                        { kind: 'block', type: 'robot_rotate_left' },
                        { kind: 'block', type: 'robot_rotate_right' },
                    ]
                },
                {
                    kind: 'category',
                    name: 'Acciones',
                    colour: '300',
                    contents: [
                        { kind: 'block', type: 'robot_toggle_hatch' },
                        { kind: 'block', type: 'robot_transform' },
                    ]
                },
                {
                    kind: 'category',
                    name: 'Componentes',
                    colour: '60',
                    contents: [
                        { kind: 'block', type: 'robot_jump' },
                        { kind: 'block', type: 'robot_toggle_lights' },
                        { kind: 'block', type: 'robot_toggle_fly' },
                    ]
                },
                {
                    kind: 'category',
                    name: 'Eventos',
                    colour: '290',
                    contents: [
                        { kind: 'block', type: 'robot_when_start' },
                        { kind: 'block', type: 'robot_on_move' },
                        { kind: 'block', type: 'robot_repeat_while_moving' },
                    ]
                },
                {
                    kind: 'category',
                    name: 'Tiempo',
                    colour: '160',
                    contents: [
                        { kind: 'block', type: 'robot_wait' },
                    ]
                },
                {
                    kind: 'category',
                    name: 'Lógica',
                    colour: '210',
                    contents: [
                        { kind: 'block', type: 'controls_if' },
                        { kind: 'block', type: 'logic_compare' },
                    ]
                },
                {
                    kind: 'category',
                    name: 'Bucles',
                    colour: '120',
                    contents: [
                        { kind: 'block', type: 'controls_repeat_ext' },
                        { kind: 'block', type: 'controls_whileUntil' },
                    ]
                },
            ]
        },
        zoom: {
            controls: true,
            wheel: true,
            startScale: 1.0,
            maxScale: 3,
            minScale: 0.3,
            scaleSpeed: 1.2
        },
        trashcan: true,
        scrollbars: true,
        sounds: true,
        grid: {
            spacing: 20,
            length: 3,
            colour: '#ccc',
            snap: true
        }
    });
}

// Program execution system
let isExecutingProgram = false;
let shouldStopExecution = false;

const programAPI = {
    async moveForward(distance) {
        const steps = Math.floor(distance * 10);
        for (let i = 0; i < steps; i++) {
            if (shouldStopExecution) break;
            controller.keys['w'] = true;
            await new Promise(resolve => setTimeout(resolve, 100));
            controller.keys['w'] = false;
        }
        await new Promise(resolve => setTimeout(resolve, 200));
    },
    
    async moveBackward(distance) {
        const steps = Math.floor(distance * 10);
        for (let i = 0; i < steps; i++) {
            if (shouldStopExecution) break;
            controller.keys['s'] = true;
            await new Promise(resolve => setTimeout(resolve, 100));
            controller.keys['s'] = false;
        }
        await new Promise(resolve => setTimeout(resolve, 200));
    },
    
    async rotateLeft(angle) {
        const radians = angle * Math.PI / 180;
        const steps = Math.floor(Math.abs(radians) / controller.rotateSpeed);
        for (let i = 0; i < steps; i++) {
            if (shouldStopExecution) break;
            controller.keys['q'] = true;
            await new Promise(resolve => setTimeout(resolve, 50));
            controller.keys['q'] = false;
        }
        await new Promise(resolve => setTimeout(resolve, 200));
    },
    
    async rotateRight(angle) {
        const radians = angle * Math.PI / 180;
        const steps = Math.floor(Math.abs(radians) / controller.rotateSpeed);
        for (let i = 0; i < steps; i++) {
            if (shouldStopExecution) break;
            controller.keys['e'] = true;
            await new Promise(resolve => setTimeout(resolve, 50));
            controller.keys['e'] = false;
        }
        await new Promise(resolve => setTimeout(resolve, 200));
    },
    
    async toggleHatch() {
        if (shouldStopExecution) return;
        controller.toggleHatch();
        await new Promise(resolve => setTimeout(resolve, 1000));
    },
    
    async transformRobot() {
        if (shouldStopExecution) return;
        controller.toggleCube();
        await new Promise(resolve => setTimeout(resolve, 2000));
    },
    
    async wait(seconds) {
        if (shouldStopExecution) return;
        await new Promise(resolve => setTimeout(resolve, seconds * 1000));
    },
    
    // Component API methods
    async jumpRobot() {
        if (shouldStopExecution) return;
        if (!controller.components.jump) {
            console.warn('Component "Saltar" not enabled. Enable it in the Inspector.');
            return;
        }
        controller.jump();
        await new Promise(resolve => setTimeout(resolve, 2000));
    },
    
    async toggleLights() {
        if (shouldStopExecution) return;
        if (!controller.components.lights) {
            console.warn('Component "Luces" not enabled. Enable it in the Inspector.');
            return;
        }
        controller.toggleLights();
        await new Promise(resolve => setTimeout(resolve, 500));
    },
    
    async toggleFly() {
        if (shouldStopExecution) return;
        if (!controller.components.fly) {
            console.warn('Component "Volar" not enabled. Enable it in the Inspector.');
            return;
        }
        controller.toggleFly();
        await new Promise(resolve => setTimeout(resolve, 1000));
    },
    
    // Event-based methods
    async executeWhileMoving(callback) {
        if (shouldStopExecution) return;
        
        // Start moving forward
        const movePromise = this.moveForward(controller.EVENT_MOVE_DISTANCE);
        
        // Execute callback while moving
        const callbackPromise = callback();
        
        // Wait for both to complete
        await Promise.all([movePromise, callbackPromise]);
    },
    
    async repeatWhileMoving(times, callback) {
        if (shouldStopExecution) return;
        
        for (let i = 0; i < times; i++) {
            if (shouldStopExecution) break;
            
            // Execute callback
            await callback();
            
            // Move forward a bit
            await this.moveForward(1);
        }
    }
};

async function executeBlocklyProgram() {
    if (isExecutingProgram || !blocklyWorkspace) return;
    
    isExecutingProgram = true;
    shouldStopExecution = false;
    
    try {
        const code = Blockly.JavaScript.workspaceToCode(blocklyWorkspace);
        
        // Create execution context with API
        const executeCode = new Function(
            'moveForward', 'moveBackward', 'rotateLeft', 'rotateRight',
            'toggleHatch', 'transformRobot', 'wait',
            'jumpRobot', 'toggleLights', 'toggleFly',
            'executeWhileMoving', 'repeatWhileMoving',
            `return (async function() {\n${code}\n})();`
        );
        
        await executeCode(
            programAPI.moveForward.bind(programAPI),
            programAPI.moveBackward.bind(programAPI),
            programAPI.rotateLeft.bind(programAPI),
            programAPI.rotateRight.bind(programAPI),
            programAPI.toggleHatch.bind(programAPI),
            programAPI.transformRobot.bind(programAPI),
            programAPI.wait.bind(programAPI),
            programAPI.jumpRobot.bind(programAPI),
            programAPI.toggleLights.bind(programAPI),
            programAPI.toggleFly.bind(programAPI),
            programAPI.executeWhileMoving.bind(programAPI),
            programAPI.repeatWhileMoving.bind(programAPI)
        );
        
        if (!shouldStopExecution) {
            alert('✅ Programa completado!');
        }
    } catch (error) {
        console.error('Error executing program:', error);
        alert('❌ Error al ejecutar el programa: ' + error.message);
    } finally {
        isExecutingProgram = false;
        shouldStopExecution = false;
    }
}

function stopBlocklyProgram() {
    shouldStopExecution = true;
    isExecutingProgram = false;
    // Reset all keys
    Object.keys(controller.keys).forEach(key => {
        controller.keys[key] = false;
    });
}

function resetRobotPosition() {
    robot.position = new BABYLON.Vector3(0, 0.5, 0);
    robot.rotation = new BABYLON.Vector3(0, 0, 0);
    
    // Reset body scaling if transformed
    if (robot.body) {
        robot.body.scaling = new BABYLON.Vector3(1, 1, 1);
    }
    if (robot.head) {
        robot.head.scaling = new BABYLON.Vector3(1, 1, 1);
    }
    if (robot.hatch) {
        robot.hatch.scaling = new BABYLON.Vector3(1, 1, 1);
        robot.hatch.rotation.x = 0;
    }
    
    controller.isCube = false;
    controller.hatchOpen = false;
}

// ============================================
// MENU AND UI SYSTEM
// ============================================

let currentView = 'robot'; // 'robot' or 'blockly'

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Blockly after a short delay
    setTimeout(initializeBlockly, 500);
    
    // Menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const sideMenu = document.getElementById('sideMenu');
    const closeMenu = document.getElementById('closeMenu');
    
    menuToggle?.addEventListener('click', () => {
        sideMenu.classList.toggle('open');
    });
    
    closeMenu?.addEventListener('click', () => {
        sideMenu.classList.remove('open');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (sideMenu.classList.contains('open') && 
            !sideMenu.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            sideMenu.classList.remove('open');
        }
    });
    
    // View switching
    const viewRobot = document.getElementById('viewRobot');
    const viewBlockly = document.getElementById('viewBlockly');
    const blocklyDiv = document.getElementById('blocklyDiv');
    const blocklyControls = document.getElementById('blocklyControls');
    const renderCanvas = document.getElementById('renderCanvas');
    
    viewRobot?.addEventListener('click', () => {
        currentView = 'robot';
        blocklyDiv.classList.remove('active');
        blocklyControls.classList.remove('active');
        renderCanvas.style.display = 'block';
        viewRobot.classList.add('active');
        viewBlockly.classList.remove('active');
        sideMenu.classList.remove('open');
    });
    
    viewBlockly?.addEventListener('click', () => {
        currentView = 'blockly';
        blocklyDiv.classList.add('active');
        blocklyControls.classList.add('active');
        renderCanvas.style.display = 'none';
        viewBlockly.classList.add('active');
        viewRobot.classList.remove('active');
        sideMenu.classList.remove('open');
        
        // Resize Blockly workspace
        if (blocklyWorkspace) {
            Blockly.svgResize(blocklyWorkspace);
        }
    });
    
    // Blockly controls
    const runBlockly = document.getElementById('runBlockly');
    const stopBlockly = document.getElementById('stopBlockly');
    const resetRobot = document.getElementById('resetRobot');
    
    runBlockly?.addEventListener('click', () => {
        // Switch to robot view to see execution
        currentView = 'robot';
        blocklyDiv.classList.remove('active');
        blocklyControls.classList.remove('active');
        renderCanvas.style.display = 'block';
        executeBlocklyProgram();
    });
    
    stopBlockly?.addEventListener('click', () => {
        stopBlocklyProgram();
    });
    
    resetRobot?.addEventListener('click', () => {
        stopBlocklyProgram();
        resetRobotPosition();
    });
    
    // Save/Load program
    const saveProgram = document.getElementById('saveProgram');
    const loadProgram = document.getElementById('loadProgram');
    const clearProgram = document.getElementById('clearProgram');
    
    saveProgram?.addEventListener('click', () => {
        if (!blocklyWorkspace) return;
        
        const xml = Blockly.Xml.workspaceToDom(blocklyWorkspace);
        const xmlText = Blockly.Xml.domToText(xml);
        
        const blob = new Blob([xmlText], { type: 'text/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'robot-program.xml';
        a.click();
        URL.revokeObjectURL(url);
        
        alert('✅ Programa guardado!');
        sideMenu.classList.remove('open');
    });
    
    loadProgram?.addEventListener('click', () => {
        if (!blocklyWorkspace) return;
        
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.xml';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const xmlText = event.target.result;
                    const xml = Blockly.Xml.textToDom(xmlText);
                    blocklyWorkspace.clear();
                    Blockly.Xml.domToWorkspace(xml, blocklyWorkspace);
                    alert('✅ Programa cargado!');
                } catch (error) {
                    alert('❌ Error al cargar el programa');
                    console.error(error);
                }
            };
            reader.readAsText(file);
        };
        
        input.click();
        sideMenu.classList.remove('open');
    });
    
    clearProgram?.addEventListener('click', () => {
        if (!blocklyWorkspace) return;
        
        if (confirm('¿Estás seguro de que quieres limpiar el workspace?')) {
            blocklyWorkspace.clear();
            alert('✅ Workspace limpio!');
        }
        sideMenu.classList.remove('open');
    });
    
    // Component system handlers
    const componentJump = document.getElementById('componentJump');
    const componentLights = document.getElementById('componentLights');
    const componentFly = document.getElementById('componentFly');
    
    componentJump?.addEventListener('change', (e) => {
        controller.components.jump = e.target.checked;
        console.log('Component Saltar:', controller.components.jump ? 'Enabled' : 'Disabled');
    });
    
    componentLights?.addEventListener('change', (e) => {
        controller.components.lights = e.target.checked;
        console.log('Component Luces:', controller.components.lights ? 'Enabled' : 'Disabled');
        
        // If disabling lights, turn them off
        if (!e.target.checked && controller.lightsEnabled) {
            controller.toggleLights();
        }
    });
    
    componentFly?.addEventListener('change', (e) => {
        controller.components.fly = e.target.checked;
        console.log('Component Volar:', controller.components.fly ? 'Enabled' : 'Disabled');
        
        // If disabling fly and robot is flying, land it
        if (!e.target.checked && controller.isFlying) {
            controller.toggleFly();
        }
    });
});
