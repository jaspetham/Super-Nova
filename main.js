import './style.css'
import './index.css' 
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import vertex from './shaders/vertex.glsl'
import fragment from './shaders/fragment.glsl'
import * as dat from 'dat.gui';
import particleTexture from './assets/particle.png';
// import gsap from 'gsap';

function lerp(a,b,t){
  return a*(1-t) + b*t;
}
export default class Sketch {
  constructor(options) {
    this.scene = new THREE.Scene();

    this.container = options.dom;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xffffff, 1); 
    this.renderer.physicallyCorrectLights = true;
    // this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.point = new THREE.Vector3();

    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      1000
    );

    this.cameraGroup = new THREE.Group();
    this.scene.add(this.cameraGroup)
    const spaceTexture = new THREE.TextureLoader().load('./space.jpg');
    this.scene.background = spaceTexture

    this.cameraGroup.add(this.camera)

    // var frustumSize = 10;
    // var aspect = window.innerWidth / window.innerHeight;
    // this.camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, -1000, 1000 );
    this.camera.position.set(1.157, 1.045, -0.035);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enabled = false
    this.time = new THREE.Clock();
    this.elapsedTime = 0;
    this.previousTime = 0;

    this.isPlaying = true;

    this.materials = []

    let opts = [
      {
        min_radius: 0.3,
        max_radius: 1.5,
        color: '#f7b373',
        size: 1,
        uAmp: 1
      },
      {
        min_radius: 0.3,
        max_radius: 1.5,
        color: '#88b3ce',
        size: 0.5,
        uAmp: 3
      },
      {
        min_radius: 0.3,
        max_radius: 1.5,
        color: '#F5D5E0',
        size: 0.4,
        uAmp: 0.25
      },
      {
        min_radius: 0.3,
        max_radius: 1.5,
        color: '#115268',
        size: 0.25,
        uAmp: 1
      },
    ]

    opts.forEach(op =>{
      this.addObject(op)
    })
    
    this.raycasterEvent();
    this.resize();
    this.render();
    this.setupResize();
    // this.settings();
  }

  raycasterEvent(){

    let mesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(10,10,10,10).rotateX(- Math.PI / 2 - 0.5),
      new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe:true
      })
    )

    let test = new THREE.Mesh(
      new THREE.SphereBufferGeometry(.25,5,5),
      new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe:true
      })
    )



    this.container.addEventListener('pointermove', (event)=>{
      this.pointer.x = ((event.clientX - this.renderer.domElement.offsetLeft) / this.width) * 2 - 1;
      this.pointer.y =  - ((event.clientY - this.renderer.domElement.offsetTop) / this.height) * 2 + 1;

      this.raycaster.setFromCamera(this.pointer, this.camera);

      const intersects = this.raycaster.intersectObjects([mesh]);
      if (intersects[0]){
        this.point.copy(intersects[0].point)
      }
    })
  }

  settings() {
    let that = this;
    this.settings = {
      x:this.camera.position.x,
      y:this.camera.position.y,
      z:this.camera.position.z,
    };
    this.gui = new dat.GUI();
    this.gui.add(this.settings, 'x', -5,5).step(0.001).onChange((value) =>{
      this.camera.position.x = value;
    });
    this.gui.add(this.settings, 'y', -5,5).step(0.001).onChange((value) =>{
      this.camera.position.y = value;
    });
    this.gui.add(this.settings, 'z', -5,5).step(0.001).onChange((value) =>{
      this.camera.position.z = value;
    });
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  addObject(opts) {
    let that = this;
    let count = 15000;
    let min_radius = opts.min_radius;
    let max_radius = opts.max_radius;

    let particlegeo = new THREE.PlaneBufferGeometry(1,1);
    let geo = new THREE.InstancedBufferGeometry();
    geo.instanceCount = count;
    geo.setAttribute('position',particlegeo.getAttribute('position'))
    geo.index = particlegeo.index;

    let pos = new Float32Array(count*3);

    for(let i = 0; i < count; i++){
      let theta = Math.random()*2*Math.PI;
      let r = lerp(min_radius, max_radius, Math.random());
      
      let x = r * Math.sin(theta);
      let y = (Math.random() - 0.5) * 0.1;
      let z = r * Math.cos(theta);
      
      pos.set([
        x,y,z
      ], i*3);
    }

    geo.setAttribute('pos', new THREE.InstancedBufferAttribute(pos,3,false))

    let material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable"
      },
      side: THREE.DoubleSide,
      uniforms: {
        uTexture: { value: new THREE.TextureLoader().load(particleTexture)},
        time: {value: 0 },
        uAmp: {value: opts.uAmp},
        uMouse: {value:new THREE.Vector3()},
        size: {value: opts.size},
        uColor: {value:new THREE.Color(opts.color)},
        resolution: { value: new THREE.Vector4() },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent:true,
      depthTest: false
    });

    this.materials.push(material);
    this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);

    this.points = new THREE.Mesh(geo, material);
    // this.points.position.y = 1;
    // this.points.rotation.z =
    this.points.rotation.x =   - Math.PI / 2 + 0.75  
    this.scene.add(this.points);
  }

  render() {
    if (!this.isPlaying) return;
    this.elapsedTime = this.time.getElapsedTime()
    this.previousTime = this.elapsedTime
    const deltaTime = this.elapsedTime - this.previousTime
    this.materials.forEach(m =>{
      m.uniforms.time.value = this.elapsedTime;
      m.uniforms.uMouse.value = this.point;
    })
    // this.material.uniforms.time.value = this.elapsedTime;

    const parallaxX = this.pointer.x;
    const parallaxY = - this.pointer.x;

    this.cameraGroup.position.y += (parallaxX - this.cameraGroup.position.y) * 0.002;
    this.cameraGroup.position.z += (parallaxY - this.cameraGroup.position.z) * 0.002;

    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}

new Sketch({
  dom: document.getElementById("container")
});

