import { Color, Scene } from "three";
import * as THREE from 'three';
import { useEffect } from "react";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SketchPicker } from "react-color";

import PickColor from "../components/pickColor/PickColor";
import Upload from "../components/upload/Upload";
export default function Home() {
  let color = 16777215;
  const objects = [];
  let txtObjects = [];
  let isShiftDown = false;

  const updateColor = (e) =>{
    let r = e.r.toString(16).length===1 ? "0" + e.r.toString(16) : e.r.toString(16);
    let g = e.g.toString(16).length===1 ? "0" + e.g.toString(16) : e.g.toString(16);
    let b = e.b.toString(16).length===1 ? "0" + e.b.toString(16) : e.b.toString(16);
    color = new THREE.Color('#'+r+g+b);
   
  }
  
  const createAndDownloadTxt = () =>
  {
    if(objects.length===0)
    return null;

      let result = "";
      for(let i = 1;i<objects.length;++i)
      result+= JSON.stringify(objects[i].material.color) + JSON.stringify(objects[i].position)+" ";
      const fileData = result;
      const blob = new Blob([fileData], { type: "text" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = "model.txt";
      link.href = url;
      link.click();
    
    
  }
  const rebuild = (file) => {
    let reader = new FileReader();
    reader.readAsText(file);
    
    reader.onload = function() {
      const result = reader.result;
      let elements = result.split(' ');
      for(let i =0;i<elements.length-1;++i){
        let col = parseInt(elements[i].substring(0, elements[i].indexOf("{"))).toString(16);
        while(true){
          if(col.length<6)
          col = "0"+col;
          else
          break;
        }
        let pos = JSON.parse(elements[i].substring(elements[i].indexOf("{"), elements[i].length));
        col = new THREE.Color('#'+col);
        const material = new THREE.MeshLambertMaterial( { color: col } );
        const cube = new THREE.BoxGeometry( 50, 50, 50 );
        let obj = new THREE.Mesh( cube, material );
        obj.position.set(pos.x,pos.y,pos.z);
        txtObjects.push( obj);
                obj = null;
        
      }
    };
  
    reader.onerror = function() {
      console.log(reader.error);
    };
  };
  useEffect(() => {
    var parentElement = document.body;
    
    var theFirstChild = parentElement.firstChild;
    if(parentElement.firstChild.nodeName !== "CANVAS"){
    const scene = new THREE.Scene();
    setInterval(()=>{
      if(txtObjects.length!==0)
      {
        for(let i=1;i<objects.length;++i){
          scene.remove(objects[i]);
        }
        objects.splice(1,objects.length)
        for(let i=0;i<txtObjects.length;++i){
          objects.push(txtObjects[i]);
          scene.add(txtObjects[i]);
        }
        txtObjects = [];
      }
    },5000);
    const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set( 500, 800, 1300 );
    camera.lookAt( 0, 0, 0 );
    scene.background = new THREE.Color( 0xf0f0f0 );
    
    var axesHelper = new THREE.AxesHelper( 3 );
    scene.add( axesHelper );
     
    const gridHelper = new THREE.GridHelper( 1000, 20 );
    scene.add( gridHelper );
    
    const ambient = new THREE.AmbientLight(0xffffff,0.5);
    scene.add(ambient);
    let light1 = new THREE.PointLight(0xc4c4c4,1);
    light1.position.set(0,300,500);
    scene.add(light1);
    let light2 = new THREE.PointLight(0xc4c4c4,1);
    light2.position.set(500,300,500);
    scene.add(light2);
    
    let raycaster = new THREE.Raycaster();
    let pointer = new THREE.Vector2(); 
    
    const renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.listenToKeyEvents( window );
    controls.enableDamping = true; 
    const geometry = new THREE.PlaneGeometry( 1000, 1000 );
            geometry.rotateX( - Math.PI / 2 );
    
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 100;
    controls.maxDistance = 2500;
    controls.maxPolarAngle = Math.PI / 2;
    
    
    
    parentElement.insertBefore(renderer.domElement, theFirstChild);
    
    
    function animate() {
      requestAnimationFrame( animate );
      renderer.render( scene, camera );
      controls.update();
      
      
    }
    
    
   
    
    document.addEventListener( 'pointermove', onPointerMove );
    window.addEventListener( 'pointerdown', onPointerDown );
    window.addEventListener( 'pointerdown', onPointerDown );
    document.addEventListener( 'keydown', onDocumentKeyDown );
    window.addEventListener( 'resize', onWindowResize, false );
    document.addEventListener( 'keyup', onDocumentKeyUp );
    const plane = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { visible: false } ) );
            scene.add( plane );
            
            objects.push( plane );
            
           
            function onPointerMove( event ) {

              pointer.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
      
              
            }      
    
    let  cubeColor = new THREE.Color( 0x000000 );

    function onDocumentKeyDown( event ) {
      if( event.keyCode === 16 )
         isShiftDown = true; 
    }
    function onDocumentKeyUp( event ) {
      if ( event.keyCode === 16 ) {
      isShiftDown = false; 
      }

    }
    function onPointerDown(event){
      pointer.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects( objects, false );
      if(intersects.length > 0){
    
        const intersect = intersects[ 0 ];
        const cubeGeo = new THREE.BoxGeometry( 50, 50, 50 );
        if ( isShiftDown ) {

          if ( intersect.object !== plane ) {

            scene.remove( intersect.object );

            objects.splice( objects.indexOf( intersect.object ), 1 );

          }
          }
          else{
        cubeColor = color;
    const cubeMaterial = new THREE.MeshLambertMaterial( { color: cubeColor } );
        let voxel = new THREE.Mesh( cubeGeo, cubeMaterial );
                voxel.position.copy( intersect.point ).add( intersect.face.normal );
                voxel.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
                
                voxel.material.color = cubeColor;
                scene.add( voxel );
                objects.push( voxel );
                voxel = null;
                //console.log(objects)
          }
      }
       
    
    }
    function onWindowResize(){
    
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    
        renderer.setSize( window.innerWidth, window.innerHeight );
    
    }
    
    animate();
}},[])

  return (
    <>
    <div style={{ position:"absolute",
    top:"2vmax",left:"2vmax"
    
    }}>
    <PickColor updateColor={updateColor}/>
      </div>
    
    <div  style={{position:"absolute",top:"4vmax",right:"4vmax"}}>
    <button  style={{marginBottom:"1vmax"}} onClick={()=>{createAndDownloadTxt()}}>Скачать файл</button>
       <Upload rebuild={rebuild}/>

    </div>
   
      </>
  )
}