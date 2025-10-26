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

    // Tracks (wheels)
    const createTrack = (x) => {
        const track = BABYLON.MeshBuilder.CreateBox(
            "track",
            { width: 1.8, height: 0.5, depth: 0.4 },
            scene
        );
        track.position = new BABYLON.Vector3(0, -0.6, x);
        track.parent = body;

        const trackMaterial = new BABYLON.StandardMaterial("trackMat", scene);
        trackMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
        track.material = trackMaterial;

        return track;
    };

    const leftTrack = createTrack(-0.6);
    const rightTrack = createTrack(0.6);

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
    robot.leftTrack = leftTrack;
    robot.rightTrack = rightTrack;
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
        
        this.keys = {};
        this.setupControls();
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

        // Movement
        if (this.keys["w"]) {
            const forward = getForwardVector();
            this.robot.position.addInPlace(forward.scale(this.moveSpeed));
            this.animateTracks();
        }
        if (this.keys["s"]) {
            const backward = getForwardVector();
            this.robot.position.addInPlace(backward.scale(-this.moveSpeed));
            this.animateTracks();
        }
        if (this.keys["a"]) {
            const left = new BABYLON.Vector3(
                Math.sin(this.robot.rotation.y - Math.PI / 2),
                0,
                Math.cos(this.robot.rotation.y - Math.PI / 2)
            );
            this.robot.position.addInPlace(left.scale(this.moveSpeed));
            this.animateTracks();
        }
        if (this.keys["d"]) {
            const right = new BABYLON.Vector3(
                Math.sin(this.robot.rotation.y + Math.PI / 2),
                0,
                Math.cos(this.robot.rotation.y + Math.PI / 2)
            );
            this.robot.position.addInPlace(right.scale(this.moveSpeed));
            this.animateTracks();
        }

        // Rotation
        if (this.keys["q"]) {
            this.robot.rotation.y += this.rotateSpeed;
        }
        if (this.keys["e"]) {
            this.robot.rotation.y -= this.rotateSpeed;
        }

        // Keep robot on ground
        if (this.robot.position.y < 0.5) {
            this.robot.position.y = 0.5;
        }
    }

    animateTracks() {
        // Simple track animation - slight rotation
        if (this.robot.leftTrack && this.robot.rightTrack) {
            this.robot.leftTrack.rotation.x += 0.1;
            this.robot.rightTrack.rotation.x += 0.1;
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
