uniform vec2 uResolution;
uniform float uTime;

void main(){
  float minResolution=min(uResolution.x,uResolution.y);
  vec2 normalizedUV=(gl_FragCoord.xy*2.-uResolution.xy)/minResolution;
  
  float displacement=-uTime*.5;
  float amplitude=0.;
  
  for(float iteration=0.;iteration<8.;++iteration){
    amplitude+=cos(iteration-displacement-amplitude*normalizedUV.x);
    
    displacement+=sin(normalizedUV.y*iteration+amplitude);
  }
  
  displacement+=uTime*.5;
  
  vec3 baseColor=vec3(cos(normalizedUV*vec2(displacement,amplitude))*.6+.4,
  cos(amplitude+displacement)*.5+.5);
  
  baseColor=cos(baseColor*atan(vec3(displacement,amplitude,2.5))*.5+.5);
  baseColor*=.8;
  
  gl_FragColor=vec4(baseColor,1.);
}