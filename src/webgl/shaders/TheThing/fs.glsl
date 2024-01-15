#define MAX_STEPS 80

uniform vec2 uMouse;
uniform vec2 uResolution;
uniform float uTime;
varying vec2 vUv;

float sdSphere(vec3 p,float s){
  return length(p)-s;
}

float sdBox(vec3 p,vec3 size){
  vec3 d=abs(p)-size;
  return length(max(d,0.))+min(max(d.x,max(d.y,d.z)),0.);
}

float sdTorus(vec3 p,float majorRadius,float minorRadius){
  vec2 q=vec2(length(p.xz)-majorRadius,p.y);
  return length(q)-minorRadius;
}

float smin(float a,float b,float k){
  float h=clamp(.5+.5*(b-a)/k,0.,1.);
  return mix(b,a,h)-k*h*(1.-h);
}

mat2 rot2D(float a){
  return mat2(cos(a),-sin(a),sin(a),cos(a));
}

float map(vec3 p){
  vec3 spherePos=vec3(tan(uTime)*3.,0,0);
  float sphere=sdSphere(p-spherePos,2.);
  
  vec3 q=p;
  q.xy*=rot2D(uTime*3.);
  q.yz*=rot2D(-uTime);
  
  vec3 boxPos=vec3(-8,0,0);
  float box=sdBox(q-boxPos,vec3(sin(uTime)*-2.));
  
  q.xy*=rot2D(uTime*1.);
  vec3 torusPos=vec3(2.,0,0);
  float torus=sdTorus(q-torusPos,2.5,.75);
  
  float ground=p.y+.2;
  float shapes=smin(sphere,box,3.);
  
  return min(sphere, ground);
}

void main() {
    vec2 uv=(gl_FragCoord.xy*2.-uResolution.xy)/uResolution.y;
    vec2 m=(uMouse.xy-uResolution.xy*.5)/uResolution.y;

    vec3 ro = vec3(0, 0, -3);
    vec3 rd = normalize(vec3(uv, 1));
    vec3 color = vec3(0.0);

    float t = 0.;

    int i = 0;
    for(i;i<MAX_STEPS;i++){
      vec3 p=ro+rd*t;// current position along the ray
      
      p.xy*=rot2D(t*.15*m.x);
      p.y+=sin(t*(m.y+1.)*.5)*.35;// wiggle ray
      
      float d=map(p);// current distance
      t+=d;
      
      color=vec3(i)/float(MAX_STEPS);// color based on the number of steps taken
      
      if(d<.001||t>100.)break;

    }

    color = vec3(t * 0.02);

    gl_FragColor = vec4(color, 1.0);
}
