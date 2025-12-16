/**
 * GPU Processor using WebGL for high-performance video frame extraction.
 * significantly faster than Canvas 2D API for 4K/1080p content.
 */

export class VideoFrameProcessor {
  private canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext | null;
  private program: WebGLProgram | null = null;
  private texture: WebGLTexture | null = null;
  private positionBuffer: WebGLBuffer | null = null;
  private texCoordBuffer: WebGLBuffer | null = null;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.gl = this.canvas.getContext('webgl', { 
      preserveDrawingBuffer: true,
      antialias: false,
      depth: false,
      stencil: false 
    });

    if (!this.gl) {
      console.warn("WebGL not supported, falling back to CPU (2D Canvas) will happen in App logic.");
      return;
    }

    this.initShaders();
    this.initBuffers();
    this.initTexture();
  }

  private initShaders() {
    if (!this.gl) return;
    const gl = this.gl;

    // Vertex Shader: Simple pass-through with Y-flip for video texture coordinates
    const vsSource = `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;
      varying vec2 v_texCoord;
      void main() {
        gl_Position = vec4(a_position, 0, 1);
        v_texCoord = vec2(a_texCoord.x, 1.0 - a_texCoord.y);
      }
    `;

    // Fragment Shader: Sample the video texture
    const fsSource = `
      precision mediump float;
      uniform sampler2D u_image;
      varying vec2 v_texCoord;
      void main() {
        gl_FragColor = texture2D(u_image, v_texCoord);
      }
    `;

    const vertexShader = this.createShader(gl.VERTEX_SHADER, vsSource);
    const fragmentShader = this.createShader(gl.FRAGMENT_SHADER, fsSource);

    if (!vertexShader || !fragmentShader) return;

    this.program = gl.createProgram();
    if (!this.program) return;

    gl.attachShader(this.program, vertexShader);
    gl.attachShader(this.program, fragmentShader);
    gl.linkProgram(this.program);
    gl.useProgram(this.program);
  }

  private createShader(type: number, source: string): WebGLShader | null {
    if (!this.gl) return null;
    const shader = this.gl.createShader(type);
    if (!shader) return null;

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  private initBuffers() {
    if (!this.gl || !this.program) return;
    const gl = this.gl;

    // Full screen quad
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);
    this.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(this.program, "a_position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    // Texture coordinates
    const texCoords = new Float32Array([
      0, 0,
      1, 0,
      0, 1,
      0, 1,
      1, 0,
      1, 1,
    ]);
    this.texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);

    const texCoordLoc = gl.getAttribLocation(this.program, "a_texCoord");
    gl.enableVertexAttribArray(texCoordLoc);
    gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);
  }

  private initTexture() {
    if (!this.gl) return;
    const gl = this.gl;
    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);

    // Set parameters for NPOT (Non-Power-Of-Two) textures which video frames usually are
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  }

  public async capture(videoElement: HTMLVideoElement): Promise<Blob | null> {
    if (!this.gl || !this.program || !this.texture) return null;
    const gl = this.gl;

    // Resize canvas to match video resolution
    if (this.canvas.width !== videoElement.videoWidth || this.canvas.height !== videoElement.videoHeight) {
        this.canvas.width = videoElement.videoWidth;
        this.canvas.height = videoElement.videoHeight;
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    }

    try {
        // Update texture with current video frame
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, videoElement);

        // Draw
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        // Convert to Blob
        return new Promise<Blob | null>((resolve) => {
            this.canvas.toBlob((blob) => {
                resolve(blob);
            }, 'image/jpeg', 0.85); // Slightly higher quality for AI analysis
        });
    } catch (e) {
        console.error("WebGL Draw Error:", e);
        return null;
    }
  }

  public destroy() {
    // Cleanup to prevent memory leaks if component unmounts
    const gl = this.gl;
    if (gl) {
        gl.deleteProgram(this.program);
        gl.deleteTexture(this.texture);
        gl.deleteBuffer(this.positionBuffer);
        gl.deleteBuffer(this.texCoordBuffer);
    }
  }
}
