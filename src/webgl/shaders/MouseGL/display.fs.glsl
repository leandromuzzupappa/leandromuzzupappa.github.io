precision highp float;
precision highp sampler2D;

varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform sampler2D uTexture;
uniform sampler2D uDithering;
uniform vec2 ditherScale;
uniform vec2 texelSize;

vec3 linearToGamma(vec3 color){
  color=max(color,vec3(0));
  return max(1.055*pow(color,vec3(.416666667))-.055,vec3(0));
}

void main(){
  vec3 c=texture2D(uTexture,vUv).rgb;
  
  #ifdef SHADING
  vec3 lc=texture2D(uTexture,vL).rgb;
  vec3 rc=texture2D(uTexture,vR).rgb;
  vec3 tc=texture2D(uTexture,vT).rgb;
  vec3 bc=texture2D(uTexture,vB).rgb;
  
  float dx=length(rc)-length(lc);
  float dy=length(tc)-length(bc);
  
  vec3 n=normalize(vec3(dx,dy,length(texelSize)));
  vec3 l=vec3(0.,0.,1.);
  
  float diffuse=clamp(dot(n,l)+.7,.7,1.);
  c*=diffuse;
  #endif
  
  float a=max(c.r,max(c.g,c.b));
  gl_FragColor=vec4(c,a);
}
