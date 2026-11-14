// Bundle das bibliotecas 3D do LAB (gera ../vendor/r3f.js e expõe window.R3F).
// Como regerar: ver o comando comentado em build.sh (rodar numa pasta com node_modules, ex.: /tmp/claude-0/r3f).
import * as React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import * as THREE from 'three';
import * as FIBER from '@react-three/fiber';
import { OrbitControls, Html, ContactShadows, Sparkles } from '@react-three/drei';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
// modelos do Blender (.glb embutido em base64 por scripts/glb2js.py; ver src/e_modelos.js)
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import htm from 'htm';
const html = htm.bind(React.createElement);
window.R3F = { React, ReactDOMClient, THREE, FIBER, DREI:{OrbitControls, Html, ContactShadows, Sparkles}, RoomEnvironment, mergeVertices, GLTFLoader, html };
