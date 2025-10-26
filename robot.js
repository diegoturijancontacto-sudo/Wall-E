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

    // Body (main box)
    const body = BABYLON.MeshBuilder.CreateBox(
        "body",
        { width: 2, height: 1.5, depth: 1.5 },
        scene
    );
    body.position.y = 1.5;
    body.parent = robot;

    const bodyMaterial = new BABYLON.StandardMaterial("bodyMat", scene);
    bodyMaterial.diffuseColor = new BABYLON.Color3(0.8, 0.7, 0.2);
    bodyMaterial.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);
    body.material = bodyMaterial;

    // Head/Eyes box
    const head = BABYLON.MeshBuilder.CreateBox(
        "head",
        { width: 1.2, height: 0.6, depth: 0.8 },
        scene
    );
    head.position = new BABYLON.Vector3(0, 0.9, 0.6);
    head.parent = body;

    const headMaterial = new BABYLON.StandardMaterial("headMat", scene);
    headMaterial.diffuseColor = new BABYLON.Color3(0.7, 0.6, 0.2);
    head.material = headMaterial;

    // Eyes
    const createEye = (x) => {
        const eye = BABYLON.MeshBuilder.CreateCylinder(
            "eye",
            { height: 0.3, diameter: 0.4 },
            scene
        );
        eye.rotation.z = Math.PI / 2;
        eye.position = new BABYLON.Vector3(x, 0.1, 0.5);
        eye.parent = head;

        const eyeMaterial = new BABYLON.StandardMaterial("eyeMat", scene);
        eyeMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        eyeMaterial.emissiveColor = new BABYLON.Color3(0.2, 0.4, 0.8);
        eye.material = eyeMaterial;

        return eye;
    };

    const leftEye = createEye(-0.3);
    const rightEye = createEye(0.3);

    // Strandbeest-style legs
    const createLeg = (x, z) => {
        const leg = new BABYLON.TransformNode("leg", scene);
        leg.parent = body;
        
        // Thigh (upper leg segment)
        const thigh = BABYLON.MeshBuilder.CreateCylinder(
            "thigh",
            { height: 0.8, diameter: 0.15 },
            scene
        );
        thigh.rotation.x = Math.PI / 2;
        thigh.position = new BABYLON.Vector3(x, -0.5, z);
        thigh.parent = leg;
        
        // Shin (lower leg segment)
        const shin = BABYLON.MeshBuilder.CreateCylinder(
            "shin",
            { height: 0.6, diameter: 0.12 },
            scene
        );
        shin.rotation.x = Math.PI / 2;
        shin.position = new BABYLON.Vector3(x, -0.9, z + 0.4);
        shin.parent = leg;
        
        // Foot
        const foot = BABYLON.MeshBuilder.CreateSphere(
            "foot",
            { diameter: 0.2 },
            scene
        );
        foot.position = new BABYLON.Vector3(x, -1.3, z + 0.7);
        foot.parent = leg;
        
        const legMaterial = new BABYLON.StandardMaterial("legMat", scene);
        legMaterial.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.3);
        thigh.material = legMaterial;
        shin.material = legMaterial;
        foot.material = legMaterial;
        
        leg.thigh = thigh;
        leg.shin = shin;
        leg.foot = foot;
        
        return leg;
    };

    // Create 4 legs (Strandbeest style - 2 on each side)
    const legs = [];
    legs.push(createLeg(-0.8, -0.5));  // Left front
    legs.push(createLeg(-0.8, 0.5));   // Left back
    legs.push(createLeg(0.8, -0.5));   // Right front
    legs.push(createLeg(0.8, 0.5));    // Right back

    // Hatch (compuerta) - front panel that opens
    const hatch = BABYLON.MeshBuilder.CreateBox(
        "hatch",
        { width: 1.5, height: 1.2, depth: 0.1 },
        scene
    );
    hatch.position = new BABYLON.Vector3(0, -0.1, 0.75);
    hatch.setPivotPoint(new BABYLON.Vector3(0, -0.6, 0));
    hatch.parent = body;

    const hatchMaterial = new BABYLON.StandardMaterial("hatchMat", scene);
    hatchMaterial.diffuseColor = new BABYLON.Color3(0.6, 0.5, 0.2);
    hatchMaterial.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    hatch.material = hatchMaterial;

    // Arms (simple boxes)
    const createArm = (x) => {
        const arm = BABYLON.MeshBuilder.CreateBox(
            "arm",
            { width: 0.2, height: 0.8, depth: 0.2 },
            scene
        );
        arm.position = new BABYLON.Vector3(x, -0.2, 0);
        arm.parent = body;

        const armMaterial = new BABYLON.StandardMaterial("armMat", scene);
        armMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        arm.material = armMaterial;

        return arm;
    };

    const leftArm = createArm(-1.1);
    const rightArm = createArm(1.1);

    robot.position.y = 0.5;

    // Store references
    robot.body = body;
    robot.head = head;
    robot.hatch = hatch;
    robot.legs = legs;
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
            display: none;
            pointer-events: none;
        `;
        
        // Movement controls (left side)
        const movementControls = document.createElement('div');
        movementControls.style.cssText = `
            position: absolute;
            left: 20px;
            bottom: 0;
            pointer-events: auto;
        `;
        
        const createTouchButton = (label, top, left) => {
            const btn = document.createElement('button');
            btn.textContent = label;
            btn.style.cssText = `
                position: absolute;
                top: ${top}px;
                left: ${left}px;
                width: 60px;
                height: 60px;
                background: rgba(76, 175, 80, 0.5);
                border: 2px solid rgba(76, 175, 80, 0.8);
                border-radius: 50%;
                color: white;
                font-size: 18px;
                font-weight: bold;
                touch-action: none;
                user-select: none;
            `;
            return btn;
        };
        
        const upBtn = createTouchButton('↑', 0, 60);
        const downBtn = createTouchButton('↓', 120, 60);
        const leftBtn = createTouchButton('←', 60, 0);
        const rightBtn = createTouchButton('→', 60, 120);
        
        movementControls.appendChild(upBtn);
        movementControls.appendChild(downBtn);
        movementControls.appendChild(leftBtn);
        movementControls.appendChild(rightBtn);
        
        // Rotation controls (right side)
        const rotationControls = document.createElement('div');
        rotationControls.style.cssText = `
            position: absolute;
            right: 20px;
            bottom: 60px;
            pointer-events: auto;
        `;
        
        const rotLeftBtn = createTouchButton('⟲', 0, 0);
        const rotRightBtn = createTouchButton('⟳', 0, 80);
        
        rotationControls.appendChild(rotLeftBtn);
        rotationControls.appendChild(rotRightBtn);
        
        // Action buttons (right side, top)
        const actionControls = document.createElement('div');
        actionControls.style.cssText = `
            position: absolute;
            right: 20px;
            top: 200px;
            pointer-events: auto;
        `;
        
        const hatchBtn = createTouchButton('🚪', 0, 0);
        const cubeBtn = createTouchButton('◻', 70, 0);
        
        actionControls.appendChild(hatchBtn);
        actionControls.appendChild(cubeBtn);
        
        touchContainer.appendChild(movementControls);
        touchContainer.appendChild(rotationControls);
        touchContainer.appendChild(actionControls);
        document.body.appendChild(touchContainer);
        
        // Show touch controls on mobile
        if (('ontouchstart' in window) || (navigator.maxTouchPoints > 0)) {
            touchContainer.style.display = 'block';
        }
        
        // Touch event handlers
        const addTouchHandler = (btn, action) => {
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.touchControls[action] = true;
                btn.style.background = 'rgba(76, 175, 80, 0.8)';
            });
            
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.touchControls[action] = false;
                btn.style.background = 'rgba(76, 175, 80, 0.5)';
            });
        };
        
        addTouchHandler(upBtn, 'moveForward');
        addTouchHandler(downBtn, 'moveBackward');
        addTouchHandler(leftBtn, 'moveLeft');
        addTouchHandler(rightBtn, 'moveRight');
        addTouchHandler(rotLeftBtn, 'rotateLeft');
        addTouchHandler(rotRightBtn, 'rotateRight');
        
        hatchBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.toggleHatch();
        });
        
        cubeBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.toggleCube();
        });
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

        // Animate legs when moving
        if (isMoving) {
            this.animateLegs();
        }

        // Keep robot on ground
        if (this.robot.position.y < 0.5) {
            this.robot.position.y = 0.5;
        }
    }

    animateLegs() {
        // Strandbeest-style walking animation
        this.walkCycle += 0.15;
        
        if (this.robot.legs && this.robot.legs.length > 0) {
            this.robot.legs.forEach((leg, index) => {
                // Alternate leg movement (front and back on opposite phases)
                const phase = (index % 2 === 0) ? this.walkCycle : this.walkCycle + Math.PI;
                
                // Strandbeest-inspired motion
                const thighAngle = Math.sin(phase) * 0.5;
                const shinAngle = Math.sin(phase + Math.PI / 4) * 0.4;
                const footHeight = Math.abs(Math.sin(phase)) * 0.3;
                
                if (leg.thigh) {
                    leg.thigh.rotation.z = thighAngle;
                }
                if (leg.shin) {
                    leg.shin.rotation.z = shinAngle;
                }
                if (leg.foot) {
                    leg.foot.position.y = -1.3 + footHeight;
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
