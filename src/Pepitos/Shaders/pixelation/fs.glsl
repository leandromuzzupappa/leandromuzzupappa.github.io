uniform float uProgress;
uniform sampler2D uTexture;
uniform sampler2D uDataTexture;
uniform vec4 uResolution;

varying vec2 vUv;

void main(){
  
  float aa=.5;
  vec2 newUV=(vUv-vec2(aa))*uResolution.zw+vec2(aa);
  vec4 color=texture2D(uTexture,newUV);
  vec4 offset=texture2D(uDataTexture,vUv);
  
  vec4 finalColor=texture2D(uTexture,vUv-.02*offset.rg);
  
  gl_FragColor=vec4(vUv,0.,1.);
  gl_FragColor=vec4(offset.r,0.,1.,1.);
  gl_FragColor=color;
  
  finalColor.rgb*=vec3(vUv.x+.5);
  
  gl_FragColor=finalColor;
  
  // darken the edges
  /* float edge=smoothstep(.0,.1,.4-length(vUv-.5));
  gl_FragColor.rgb*=1.-edge; */
  
}
