interface ShaderProgram
{
    program : WebGLProgram;
    vertexSource: string;
    fragmentSource: string;

    activate() : void;
}