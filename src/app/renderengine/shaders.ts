var SHADERS = {
    "bitmask.frag": {
        "source": "precision highp float;\n\nvarying vec2 v_texCoord;\nuniform sampler2D u_bitmask;\n\nvoid main() {\n    vec4 texColor = texture2D(u_sampler, v_texCoord);\n    float mask = texture2D(u_bitmask, v_texCoord).a;\n\n    if (mask == 0) {\n        discard;\n    }\n\n    gl_FragColor = vec4(0.3, 0.6, 0.8, 0.35);\n}",
        "type": "x-shader/x-fragment"
    },
    "brightness.frag": {
        "source": "precision highp float;\n\nvarying vec2 v_texCoord;\n\nuniform float u_brightness;\nuniform sampler2D u_sampler;\n\nvoid main() {\n\tvec4 texColor = texture2D(u_sampler, v_texCoord);\n\tgl_FragColor = vec4(texColor.rgb*u_brightness, texColor.a);\n}\n",
        "type": "x-shader/x-fragment"
    },
    "colorize.frag": {
        "source": "precision mediump float;\n\nuniform vec3 u_color;\nuniform sampler2D u_texture;\nvarying vec2 v_texCoord;\n\nvoid main() {\n\tgl_FragColor = texture2D(u_texture, v_texCoord) + vec4(u_color, 0.0);\n}\n",
        "type": "x-shader/x-fragment"
    },
    "contrast.frag": {
        "source": "precision mediump float;\n\nconst vec3 gHalf = vec3(.5, .5, .5);\nvarying vec2 v_texCoord;\n\nuniform float u_contrastValue ;\nuniform sampler2D u_texture;\n\nvoid main() {\n\tvec4 texColor = texture2D(u_texture, v_texCoord);\n\tvec3 result = (texColor.xyz - gHalf) * u_contrastValue + gHalf;\n\tgl_FragColor = vec4(result, 1.0);\n}\n",
        "type": "x-shader/x-fragment"
    },
    "filter.vert": {
        "source": "attribute vec2 a_position;\nattribute vec2 a_texCoord;\n\nvarying highp vec2 v_texCoord;\n\nvoid main(void) {\n  gl_Position = vec4(a_position, 0, 1);\n  v_texCoord = a_texCoord;\n}",
        "type": "x-shader/x-vertex"
    },
    "identity.vert": {
        "source": "attribute vec2 a_position;\nattribute vec2 a_texCoord;\n\nvarying highp vec2 v_texCoord;\n\nvoid main(void) {\n  gl_Position = vec4(a_position, 0, 1);\n  v_texCoord = a_texCoord;\n}",
        "type": "x-shader/x-vertex"
    },
    "image.frag": {
        "source": "varying highp vec2 v_texCoord;\n\nuniform sampler2D u_sampler;\n\nvoid main(void) {\n    gl_FragColor = texture2D(u_sampler, v_texCoord);\n}\n",
        "type": "x-shader/x-fragment"
    },
    "image.vert": {
        "source": "attribute vec2 a_position;\nattribute vec2 a_texCoord;\n\nvarying highp vec2 v_texCoord;\n\nuniform mat3 u_matrix;\n\nvoid main(void) {\n  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 1, 1);\n  v_texCoord = a_texCoord;\n}",
        "type": "x-shader/x-vertex"
    },
    "invert-colors.frag": {
        "source": "precision mediump float;\n\nuniform sampler2D u_texture;\nvarying vec2 v_texCoord;\n\nvoid main() {\n    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0) - texture2D(u_texture, v_texCoord) + vec4(0, 0, 0, 1.0);\n}\n\n",
        "type": "x-shader/x-fragment"
    },
    "noise.frag": {
        "source": "precision mediump float;\n\nfloat rand(vec2 co){\n    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);\n}\n\nuniform vec3 u_seed;\nuniform float u_noiseValue;\nuniform sampler2D u_texture;\nvarying vec2 v_texCoord;\n\nvoid main() {\n    vec4 texColor = texture2D(u_texture, v_texCoord);\n    float randF = rand(v_texCoord.xy + u_seed.xy);\n\tvec3 result = u_noiseValue * 2.0 * (vec3(randF) - 0.5);\n\n    gl_FragColor = vec4(texColor.rgb + result, texColor.a);\n}\n",
        "type": "x-shader/x-fragment"
    },
    "saturation.frag": {
        "source": "precision mediump float;\n\nconst vec3 gMonoMult = vec3(0.299, 0.587, 0.114);\n\nuniform float u_saturationValue;\nuniform sampler2D u_texture;\nvarying vec2 v_texCoord;\n\nvoid main() {\n\tvec4 texColor = texture2D(u_texture, v_texCoord);\n\tvec3 result = vec3(dot(texColor.xyz, gMonoMult));\n\n\tresult = mix(result, texColor.xyz, u_saturationValue);\n\tgl_FragColor = vec4(result, 1.0);\n}\n",
        "type": "x-shader/x-fragment"
    },
    "selection.frag": {
        "source": "precision highp float;\n\nvarying vec2 v_texCoord;\nuniform sampler2D u_bitmask;\n\nvoid main() {\n    float mask = texture2D(u_bitmask, v_texCoord).a;\n\n    if (mask == 0.0) {\n    discard;\n    }\n\n    gl_FragColor = vec4(0.3, 0.6, 0.8, 1.0);\n}\n",
        "type": "x-shader/x-fragment"
    },
    "sepia.frag": {
        "source": "precision mediump float;\n\nconst vec3 gMonoMult = vec3(0.299, 0.587, 0.114);\n\nuniform float u_depth;\nuniform float u_intensity;\nuniform sampler2D u_texture;\nvarying vec2 v_texCoord;\n\nvoid main() {\n\tvec4 texColor = texture2D(u_texture, v_texCoord);\n\tvec3 luma = vec3(dot(texColor.xyz, gMonoMult));\n\n\tgl_FragColor = vec4(luma + vec3(u_depth * 2, u_depth, - u_intensity), 1.0);\n}\n",
        "type": "x-shader/x-fragment"
    }
}
