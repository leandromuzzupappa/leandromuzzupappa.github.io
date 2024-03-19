import {
  advectionFragmentData,
  baseVertexData,
  clearFragmentData,
  copyFragmentData,
  curlFragmentData,
  displayFragmentData,
  divergenceFragmentData,
  gradientSubtractFragmentData,
  pressureFragmentData,
  splatFragmentData,
  vorticityFragmentData,
} from "@/webgl/shaders/MouseGL";

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
type TargetType = {
  texture: WebGLTexture,
  fbo: WebGLFramebuffer,
  width: number,
  height: number,
  texelSizeX: number,
  texelSizeY: number,
  attach: (id: number) => number
  read?: any,
  write?: any,
}

type ColorType = number[];

type UniformsType = {
  [key: string]: WebGLUniformLocation
}

export function initFluid(canvas: HTMLCanvasElement) {
  resizeCanvas();

  const config = {
    SIM_RESOLUTION: 128,
    DYE_RESOLUTION: 1440 / 2,
    CAPTURE_RESOLUTION: 512,
    DENSITY_DISSIPATION: 8.5,
    VELOCITY_DISSIPATION: 2,
    PRESSURE: 0.1,
    PRESSURE_ITERATIONS: 10,
    CURL: 1,
    SPLAT_RADIUS: 0.1,
    SPLAT_FORCE: 6000,
    SHADING: true,
    COLOR_UPDATE_SPEED: .6,
  }

  class PointerPrototype {
    id: number;
    texcoordX: number;
    texcoordY: number;
    prevTexcoordX: number;
    prevTexcoordY: number;
    deltaX: number;
    deltaY: number;
    down: boolean;
    moved: boolean;
    color: number[];


    constructor() {
      this.id = -1;
      this.texcoordX = 0;
      this.texcoordY = 0;
      this.prevTexcoordX = 0;
      this.prevTexcoordY = 0;
      this.deltaX = 0;
      this.deltaY = 0;
      this.down = false;
      this.moved = false;
      this.color = [10, 0, 10];
    }
  }

  const pointers: PointerPrototype[] = [];
  pointers.push(new PointerPrototype());

  const { gl, ext } = getWebGLContext(canvas);

  if (!ext.supportLinearFiltering) {
    config.DYE_RESOLUTION = 512;
    config.SHADING = false;
  }

  function getWebGLContext(canvas: HTMLCanvasElement) {
    const params = { alpha: true, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false };

    const gl = canvas.getContext('webgl2', params) as WebGL2RenderingContext;

    gl.getExtension('EXT_color_buffer_float');
    const supportLinearFiltering = gl.getExtension('OES_texture_float_linear');

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    const halfFloatTexType = gl.HALF_FLOAT;
    const formatRGBA = getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, halfFloatTexType);
    const formatRG = getSupportedFormat(gl, gl.RG16F, gl.RG, halfFloatTexType);
    const formatR = getSupportedFormat(gl, gl.R16F, gl.RED, halfFloatTexType);

    return {
      gl,
      ext: {
        formatRGBA,
        formatRG,
        formatR,
        halfFloatTexType,
        supportLinearFiltering
      }
    };
  }

  function getSupportedFormat(
    gl: WebGL2RenderingContext,
    internalFormat: number,
    format: number,
    type: number
  ) {
    if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
      switch (internalFormat) {
        case gl.R16F:
          return getSupportedFormat(gl, gl.RG16F, gl.RG, type);
        case gl.RG16F:
          return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type);
        default:
          return null;
      }
    }

    return {
      internalFormat,
      format
    }
  }

  function supportRenderTextureFormat(
    gl: WebGL2RenderingContext,
    internalFormat: number,
    format: number,
    type: number
  ) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);

    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    return status == gl.FRAMEBUFFER_COMPLETE;
  }

  class Material {
    vertexShader: WebGLShader;
    fragmentShaderSource: string;
    programs: WebGLProgram[];
    activeProgram: WebGLProgram | null;
    uniforms: UniformsType;

    constructor(vertexShader: WebGLShader, fragmentShaderSource: string) {
      this.vertexShader = vertexShader;
      this.fragmentShaderSource = fragmentShaderSource;
      this.programs = [];
      this.activeProgram = null;
      this.uniforms = {};
    }

    setKeywords(keywords: string[]) {
      let hash = 0;
      for (let i = 0; i < keywords.length; i++)
        hash += hashCode(keywords[i]);

      let program = this.programs[hash];
      if (program == null) {
        const fragmentShader = compileShader(gl.FRAGMENT_SHADER, this.fragmentShaderSource, keywords);
        program = createProgram(this.vertexShader, fragmentShader)!;
        this.programs[hash] = program;
      }

      if (program == this.activeProgram) return;

      this.uniforms = getUniforms(program);
      this.activeProgram = program;
    }

    bind() {
      gl.useProgram(this.activeProgram);
    }
  }

  class Program {
    uniforms: UniformsType;
    program: WebGLProgram;
    constructor(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
      this.uniforms = {};
      this.program = createProgram(vertexShader, fragmentShader)!;
      this.uniforms = getUniforms(this.program);
    }

    bind() {
      gl.useProgram(this.program);
    }
  }

  function createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
    const program = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
      console.trace(gl.getProgramInfoLog(program));

    return program;
  }

  function getUniforms(program: WebGLProgram) {
    const uniforms: UniformsType = {};

    const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < uniformCount; i++) {
      const uniformName = gl.getActiveUniform(program, i)!.name;
      uniforms[uniformName] = gl.getUniformLocation(program, uniformName)!;
    }
    return uniforms;
  }

  function compileShader(
    type: number,
    source: string,
    keywords: string[] | null = null
  ) {
    source = addKeywords(source, keywords);

    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
      console.trace(gl.getShaderInfoLog(shader));

    return shader;

  }

  function addKeywords(source: string, keywords: string[] | null) {
    if (keywords == null) return source;
    let keywordsString = '';
    keywords.forEach(keyword => {
      keywordsString += '#define ' + keyword + '\n';
    });

    return keywordsString + source;
  }

  const baseVertexShader = compileShader(gl.VERTEX_SHADER, baseVertexData);

  const copyShader = compileShader(gl.FRAGMENT_SHADER, copyFragmentData);

  const clearShader = compileShader(gl.FRAGMENT_SHADER, clearFragmentData);

  const displayShaderSource = displayFragmentData;

  const splatShader = compileShader(gl.FRAGMENT_SHADER, splatFragmentData);

  const advectionShader = compileShader(gl.FRAGMENT_SHADER, advectionFragmentData,
    ext.supportLinearFiltering ? null : ['MANUAL_FILTERING']
  );

  const divergenceShader = compileShader(gl.FRAGMENT_SHADER, divergenceFragmentData);

  const curlShader = compileShader(gl.FRAGMENT_SHADER, curlFragmentData);

  const vorticityShader = compileShader(gl.FRAGMENT_SHADER, vorticityFragmentData);

  const pressureShader = compileShader(gl.FRAGMENT_SHADER, pressureFragmentData);

  const gradientSubtractShader = compileShader(gl.FRAGMENT_SHADER, gradientSubtractFragmentData);

  const blit = (() => {
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    return (
      target: TargetType | null = null,
      clear = false
    ) => {
      if (target == null) {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      }
      else {
        gl.viewport(0, 0, target.width, target.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
      }
      if (clear) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
      // CHECK_FRAMEBUFFER_STATUS();
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    }
  })();

  let dye: any;
  let velocity: any;
  let divergence: any;
  let curl: any;
  let pressure: any;

  const copyProgram = new Program(baseVertexShader, copyShader);
  const clearProgram = new Program(baseVertexShader, clearShader);
  const splatProgram = new Program(baseVertexShader, splatShader);
  const advectionProgram = new Program(baseVertexShader, advectionShader);
  const divergenceProgram = new Program(baseVertexShader, divergenceShader);
  const curlProgram = new Program(baseVertexShader, curlShader);
  const vorticityProgram = new Program(baseVertexShader, vorticityShader);
  const pressureProgram = new Program(baseVertexShader, pressureShader);
  const gradienSubtractProgram = new Program(baseVertexShader, gradientSubtractShader);

  const displayMaterial = new Material(baseVertexShader, displayShaderSource);

  function initFramebuffers() {
    const simRes = getResolution(config.SIM_RESOLUTION);
    const dyeRes = getResolution(config.DYE_RESOLUTION);

    const texType = ext.halfFloatTexType;
    const rgba = ext.formatRGBA;
    const rg = ext.formatRG;
    const r = ext.formatR;
    const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;

    gl.disable(gl.BLEND);

    if (dye == null)
      dye = createDoubleFBO(dyeRes.width, dyeRes.height, rgba!.internalFormat, rgba!.format, texType, filtering);
    else
      dye = resizeDoubleFBO(dye, dyeRes.width, dyeRes.height, rgba!.internalFormat, rgba!.format, texType, filtering);

    if (velocity == null)
      velocity = createDoubleFBO(simRes.width, simRes.height, rg!.internalFormat, rg!.format, texType, filtering);
    else
      velocity = resizeDoubleFBO(velocity, simRes.width, simRes.height, rg!.internalFormat, rg!.format, texType, filtering);

    divergence = createFBO(simRes.width, simRes.height, r!.internalFormat, r!.format, texType, gl.NEAREST);
    curl = createFBO(simRes.width, simRes.height, r!.internalFormat, r!.format, texType, gl.NEAREST);
    pressure = createDoubleFBO(simRes.width, simRes.height, r!.internalFormat, r!.format, texType, gl.NEAREST);

  }

  function createFBO(
    w: number,
    h: number,
    internalFormat: number,
    format: number,
    type: number,
    param: number
  ) {
    gl.activeTexture(gl.TEXTURE0);
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.viewport(0, 0, w, h);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const texelSizeX = 1.0 / w;
    const texelSizeY = 1.0 / h;

    return {
      texture,
      fbo,
      width: w,
      height: h,
      texelSizeX,
      texelSizeY,
      attach(id: number) {
        gl.activeTexture(gl.TEXTURE0 + id);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        return id;
      }
    };
  }

  function createDoubleFBO(
    w: number,
    h: number,
    internalFormat: number,
    format: number,
    type: number,
    param: number
  ) {
    let fbo1 = createFBO(w, h, internalFormat, format, type, param);
    let fbo2 = createFBO(w, h, internalFormat, format, type, param);

    return {
      width: w,
      height: h,
      texelSizeX: fbo1.texelSizeX,
      texelSizeY: fbo1.texelSizeY,
      get read() {
        return fbo1;
      },
      set read(value) {
        fbo1 = value;
      },
      get write() {
        return fbo2;
      },
      set write(value) {
        fbo2 = value;
      },
      swap() {
        const temp = fbo1;
        fbo1 = fbo2;
        fbo2 = temp;
      }
    }
  }

  function resizeFBO(
    target: TargetType,
    w: number,
    h: number,
    internalFormat: number,
    format: number,
    type: number,
    param: number
  ) {
    const newFBO = createFBO(w, h, internalFormat, format, type, param);
    copyProgram.bind();
    // @ts-ignore
    gl.uniform1i(copyProgram.uniforms.uTexture, target.attach(0));

    // @ts-ignore
    blit(newFBO);
    return newFBO;
  }

  function resizeDoubleFBO(
    target: TargetType,
    w: number,
    h: number,
    internalFormat: number,
    format: number,
    type: number,
    param: number,
  ) {
    if (target.width == w && target.height == h)
      return target;
    target.read = resizeFBO(target.read, w, h, internalFormat, format, type, param);
    target.write = createFBO(w, h, internalFormat, format, type, param);
    target.width = w;
    target.height = h;
    target.texelSizeX = 1.0 / w;
    target.texelSizeY = 1.0 / h;
    return target;
  }

  function updateKeywords() {
    const displayKeywords = [];
    if (config.SHADING) displayKeywords.push("SHADING");
    displayMaterial.setKeywords(displayKeywords);
  }

  updateKeywords();
  initFramebuffers();

  let lastUpdateTime = Date.now();
  let colorUpdateTimer = 0.0;

  function update() {
    const dt = calcDeltaTime();
    // console.log(dt)
    if (resizeCanvas())
      initFramebuffers();
    updateColors(dt);
    applyInputs();
    step(dt);
    render(null);
    requestAnimationFrame(update);
  }

  function calcDeltaTime() {
    const now = Date.now();
    let dt = (now - lastUpdateTime) / 1000;
    dt = Math.min(dt, 0.016666);
    lastUpdateTime = now;
    return dt;
  }

  function resizeCanvas() {
    const width = scaleByPixelRatio(canvas.clientWidth);
    const height = scaleByPixelRatio(canvas.clientHeight);

    if (canvas.width != width || canvas.height != height) {
      canvas.width = width;
      canvas.height = height;
      return true;
    }
    return false;
  }

  function updateColors(dt: number) {

    colorUpdateTimer += dt * config.COLOR_UPDATE_SPEED;
    if (colorUpdateTimer >= 1) {
      colorUpdateTimer = wrap(colorUpdateTimer, 0, 1);
      pointers.forEach(p => {
        p.color = generateColor();
      });
    }
  }

  function applyInputs() {
    pointers.forEach(p => {
      if (p.moved) {
        p.moved = false;
        splatPointer(p);
      }
    });
  }

  function step(dt: number) {
    gl.disable(gl.BLEND);

    curlProgram.bind();
    gl.uniform2f(curlProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
    blit(curl);

    vorticityProgram.bind();
    gl.uniform2f(vorticityProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0));
    gl.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1));
    gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
    gl.uniform1f(vorticityProgram.uniforms.dt, dt);
    blit(velocity.write);
    velocity.swap();

    divergenceProgram.bind();
    gl.uniform2f(divergenceProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0));
    blit(divergence);

    clearProgram.bind();
    gl.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0));
    gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE);
    blit(pressure.write);
    pressure.swap();

    pressureProgram.bind();
    gl.uniform2f(pressureProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0));
    for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
      gl.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1));
      blit(pressure.write);
      pressure.swap();
    }

    gradienSubtractProgram.bind();
    gl.uniform2f(gradienSubtractProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(gradienSubtractProgram.uniforms.uPressure, pressure.read.attach(0));
    gl.uniform1i(gradienSubtractProgram.uniforms.uVelocity, velocity.read.attach(1));
    blit(velocity.write);
    velocity.swap();

    advectionProgram.bind();
    gl.uniform2f(advectionProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    if (!ext.supportLinearFiltering)
      gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, velocity.texelSizeX, velocity.texelSizeY);
    const velocityId = velocity.read.attach(0);
    gl.uniform1i(advectionProgram.uniforms.uVelocity, velocityId);
    gl.uniform1i(advectionProgram.uniforms.uSource, velocityId);
    gl.uniform1f(advectionProgram.uniforms.dt, dt);
    gl.uniform1f(advectionProgram.uniforms.dissipation, config.VELOCITY_DISSIPATION);
    blit(velocity.write);
    velocity.swap();

    if (!ext.supportLinearFiltering)
      gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, dye.texelSizeX, dye.texelSizeY);
    gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
    gl.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1));
    gl.uniform1f(advectionProgram.uniforms.dissipation, config.DENSITY_DISSIPATION);
    blit(dye.write);
    dye.swap();
  }

  function render(target: TargetType | null) {
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);
    drawDisplay(target);
  }

  function drawDisplay(target: TargetType | null) {
    const width = target == null ? gl.drawingBufferWidth : target.width;
    const height = target == null ? gl.drawingBufferHeight : target.height;

    displayMaterial.bind();
    if (config.SHADING)
      gl.uniform2f(displayMaterial.uniforms.texelSize, 1.0 / width, 1.0 / height);
    gl.uniform1i(displayMaterial.uniforms.uTexture, dye.read.attach(0));
    blit(target);
  }

  function splatPointer(pointer: PointerPrototype) {
    const dx = pointer.deltaX * config.SPLAT_FORCE;
    const dy = pointer.deltaY * config.SPLAT_FORCE;
    splat(pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color);
  }

  function clickSplat(pointer: PointerPrototype) {
    const color = generateColor();
    color[0] = color[0] || 0 * 10.0;
    color[1] = color[1] || 0 * 10.0;
    color[2] = color[2] || 0 * 10.0;
    const dx = 10 * (Math.random() - 0.5);
    const dy = 30 * (Math.random() - 0.5);
    splat(pointer.texcoordX, pointer.texcoordY, dx, dy, color);
  }

  function splat(
    x: number,
    y: number,
    dx: number,
    dy: number,
    color: ColorType
  ) {
    splatProgram.bind();
    gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
    gl.uniform1f(splatProgram.uniforms.aspectRatio, canvas.width / canvas.height);
    gl.uniform2f(splatProgram.uniforms.point, x, y);
    gl.uniform3f(splatProgram.uniforms.color, dx, dy, 0.0);
    gl.uniform1f(splatProgram.uniforms.radius, correctRadius(config.SPLAT_RADIUS / 100.0));
    blit(velocity.write);
    velocity.swap();

    gl.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0));
    gl.uniform3f(splatProgram.uniforms.color, color[0], color[1], color[2]);
    blit(dye.write);
    dye.swap();
  }

  function correctRadius(radius: number) {
    const aspectRatio = canvas.width / canvas.height;
    if (aspectRatio > 1)
      radius *= aspectRatio;
    return radius;
  }

  window.addEventListener('mousedown', e => {
    const pointer = pointers[0];
    const posX = scaleByPixelRatio(e.clientX);
    const posY = scaleByPixelRatio(e.clientY);
    updatePointerDownData(pointer, -1, posX, posY);
    clickSplat(pointer);
  });

  document.body.addEventListener('mousemove', e => {
    const pointer = pointers[0];
    const posX = scaleByPixelRatio(e.clientX);
    const posY = scaleByPixelRatio(e.clientY);
    const color = generateColor();
    update();
    updatePointerMoveData(pointer, posX, posY, color);

  }, { once: true });

  window.addEventListener('mousemove', e => {
    const pointer = pointers[0];
    const posX = scaleByPixelRatio(e.clientX);
    const posY = scaleByPixelRatio(e.clientY);
    const color = pointer.color;
    updatePointerMoveData(pointer, posX, posY, color);
  });

  document.body.addEventListener('touchstart', e => {
    const touches = e.targetTouches;
    const pointer = pointers[0];
    for (let i = 0; i < touches.length; i++) {
      const posX = scaleByPixelRatio(touches[i].clientX);
      const posY = scaleByPixelRatio(touches[i].clientY);
      update();
      updatePointerDownData(pointer, touches[i].identifier, posX, posY);
    }
  }, { once: true });

  window.addEventListener('touchstart', e => {
    const touches = e.targetTouches;
    const pointer = pointers[0];
    for (let i = 0; i < touches.length; i++) {
      const posX = scaleByPixelRatio(touches[i].clientX);
      const posY = scaleByPixelRatio(touches[i].clientY);
      updatePointerDownData(pointer, touches[i].identifier, posX, posY);
    }
  });

  window.addEventListener('touchmove', e => {
    const touches = e.targetTouches;
    const pointer = pointers[0];
    for (let i = 0; i < touches.length; i++) {
      const posX = scaleByPixelRatio(touches[i].clientX);
      const posY = scaleByPixelRatio(touches[i].clientY);
      updatePointerMoveData(pointer, posX, posY, pointer.color);
    }
  }, false);

  window.addEventListener('touchend', e => {
    const touches = e.changedTouches;
    const pointer = pointers[0];

    for (let i = 0; i < touches.length; i++) {
      updatePointerUpData(pointer);
    }
  });

  function updatePointerDownData(
    pointer: PointerPrototype,
    id: number,
    posX: number,
    posY: number
  ) {
    pointer.id = id;
    pointer.down = true;
    pointer.moved = false;
    pointer.texcoordX = posX / canvas.width;
    pointer.texcoordY = 1.0 - posY / canvas.height;
    pointer.prevTexcoordX = pointer.texcoordX;
    pointer.prevTexcoordY = pointer.texcoordY;
    pointer.deltaX = 0;
    pointer.deltaY = 0;
    pointer.color = generateColor();
  }

  function updatePointerMoveData(
    pointer: PointerPrototype,
    posX: number,
    posY: number,
    color: ColorType
  ) {
    // pointer.down = false;
    pointer.prevTexcoordX = pointer.texcoordX;
    pointer.prevTexcoordY = pointer.texcoordY;
    pointer.texcoordX = posX / canvas.width;
    pointer.texcoordY = 1.0 - posY / canvas.height;
    pointer.deltaX = correctDeltaX(pointer.texcoordX - pointer.prevTexcoordX);
    pointer.deltaY = correctDeltaY(pointer.texcoordY - pointer.prevTexcoordY);
    pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
    pointer.color = color;
  }

  function updatePointerUpData(pointer: PointerPrototype) {
    pointer.down = false;
  }

  function correctDeltaX(delta: number) {
    const aspectRatio = canvas.width / canvas.height;
    if (aspectRatio < 1) delta *= aspectRatio;
    return delta;
  }

  function correctDeltaY(delta: number) {
    const aspectRatio = canvas.width / canvas.height;
    if (aspectRatio > 1) delta /= aspectRatio;
    return delta;
  }

  function generateColor() {
    const c = HSVtoRGB(Math.random());
    c.r = (c.r || 1) * 0.00275;
    c.g = (c.g || 1) * 0.00244;
    c.b = (c.b || 1) * 0.00100;

    return [0.14 * c.r, .32 * c.g, 1. * c.b];
  }

  function HSVtoRGB(
    h: number,
  ) {
    let r, g, b;
    const i = Math.floor(h * 3);

    switch (i % 3) {
      case 0: r = 60, g = 184, b = 275; break;
      case 1: r = 60, g = 184, b = 211; break;
      case 2: r = 60, g = 184, b = 275; break;
    }

    return {
      r,
      g,
      b
    };
  }

  function wrap(
    value: number,
    min: number,
    max: number
  ) {
    const range = max - min;
    if (range == 0) return min;
    return (value - min) % range + min;
  }

  function getResolution(resolution: number) {
    let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
    if (aspectRatio < 1)
      aspectRatio = 1.0 / aspectRatio;

    const min = Math.round(resolution);
    const max = Math.round(resolution * aspectRatio);

    if (gl.drawingBufferWidth > gl.drawingBufferHeight)
      return { width: max, height: min };
    else
      return { width: min, height: max };
  }

  function scaleByPixelRatio(input: number) {
    const pixelRatio = window.devicePixelRatio || 1;
    return Math.floor(input * pixelRatio);
  }

  function hashCode(s: string) {
    if (s.length == 0) return 0;
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
      hash = (hash << 5) - hash + s.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }
}
