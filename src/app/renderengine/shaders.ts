var SHADERS = {
    "bitmask.frag": {
        "source": "precision highp float;\r\n\r\nvarying vec2 v_texCoord;\r\nuniform sampler2D u_bitmask;\r\n\r\nvoid main() {\r\n    vec4 texColor = texture2D(u_sampler, v_texCoord);\r\n    float mask = texture2D(u_bitmask, v_texCoord).a;\r\n\r\n    if (mask == 0) {\r\n        discard;\r\n    }\r\n\r\n    gl_FragColor = vec4(0.3, 0.6, 0.8, 0.35);\r\n}",
        "type": "x-shader/x-fragment"
    },
    "brightness.frag": {
        "source": "precision highp float;\r\n\r\nvarying vec2 v_texCoord;\r\n\r\nuniform float u_brightness;\r\nuniform sampler2D u_sampler;\r\n\r\nvoid main() {\r\n\tvec4 texColor = texture2D(u_sampler, v_texCoord);\r\n\tgl_FragColor = vec4(texColor.rgb*u_brightness, texColor.a);\r\n}\r\n",
        "type": "x-shader/x-fragment"
    },
    "colorize.frag": {
        "source": "precision mediump float;\r\n\r\nuniform vec3 u_color;\r\nuniform sampler2D u_texture;\r\nvarying vec2 v_texCoord;\r\n\r\nvoid main() {\r\n\tgl_FragColor = texture2D(u_texture, v_texCoord) + vec4(u_color, 0.0);\r\n}\r\n",
        "type": "x-shader/x-fragment"
    },
    "contrast.frag": {
        "source": "precision mediump float;\r\n\r\nconst vec3 gHalf = vec3(.5, .5, .5);\r\nvarying vec2 v_texCoord;\r\n\r\nuniform float u_contrastValue ;\r\nuniform sampler2D u_texture;\r\n\r\nvoid main() {\r\n\tvec4 texColor = texture2D(u_texture, v_texCoord);\r\n\tvec3 result = (texColor.xyz - gHalf) * u_contrastValue + gHalf;\r\n\tgl_FragColor = vec4(result, 1.0);\r\n}\r\n",
        "type": "x-shader/x-fragment"
    },
    "filter.vert": {
        "source": "attribute vec2 a_position;\r\nattribute vec2 a_texCoord;\r\n\r\nvarying highp vec2 v_texCoord;\r\n\r\nvoid main(void) {\r\n  gl_Position = vec4(a_position, 0, 1);\r\n  v_texCoord = a_texCoord;\r\n}",
        "type": "x-shader/x-vertex"
    },
    "identity.vert": {
        "source": "attribute vec2 a_position;\r\nattribute vec2 a_texCoord;\r\n\r\nvarying highp vec2 v_texCoord;\r\n\r\nvoid main(void) {\r\n  gl_Position = vec4(a_position, 0, 1);\r\n  v_texCoord = a_texCoord;\r\n}",
        "type": "x-shader/x-vertex"
    },
    "image.frag": {
        "source": "varying highp vec2 v_texCoord;\r\n\r\nuniform sampler2D u_sampler;\r\n\r\nvoid main(void) {\r\n    gl_FragColor = texture2D(u_sampler, v_texCoord);\r\n}\r\n",
        "type": "x-shader/x-fragment"
    },
    "image.vert": {
        "source": "attribute vec2 a_position;\r\nattribute vec2 a_texCoord;\r\n\r\nvarying highp vec2 v_texCoord;\r\n\r\nuniform mat3 u_matrix;\r\n\r\nvoid main(void) {\r\n  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 1, 1);\r\n  v_texCoord = a_texCoord;\r\n}",
        "type": "x-shader/x-vertex"
    },
    "invert-colors.frag": {
        "source": "precision mediump float;\r\n\r\nuniform sampler2D u_texture;\r\nvarying vec2 v_texCoord;\r\n\r\nvoid main() {\r\n    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0) - texture2D(u_texture, v_texCoord) + vec4(0, 0, 0, 1.0);\r\n}\r\n\r\n",
        "type": "x-shader/x-fragment"
    },
    "noise.frag": {
        "source": "precision mediump float;\r\n\r\nfloat rand(vec2 co){\r\n    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);\r\n}\r\n\r\nuniform vec3 u_seed;\r\nuniform float u_noiseValue;\r\nuniform sampler2D u_texture;\r\nvarying vec2 v_texCoord;\r\n\r\nvoid main() {\r\n    vec4 texColor = texture2D(u_texture, v_texCoord);\r\n    float randF = rand(v_texCoord.xy + u_seed.xy);\r\n\tvec3 result = u_noiseValue * 2.0 * (vec3(randF) - 0.5);\r\n\r\n    gl_FragColor = vec4(texColor.rgb + result, texColor.a);\r\n}\r\n",
        "type": "x-shader/x-fragment"
    },
    "saturation.frag": {
        "source": "precision mediump float;\r\n\r\nconst vec3 gMonoMult = vec3(0.299, 0.587, 0.114);\r\n\r\nuniform float u_saturationValue;\r\nuniform sampler2D u_texture;\r\nvarying vec2 v_texCoord;\r\n\r\nvoid main() {\r\n\tvec4 texColor = texture2D(u_texture, v_texCoord);\r\n\tvec3 result = vec3(dot(texColor.xyz, gMonoMult));\r\n\r\n\tresult = mix(result, texColor.xyz, u_saturationValue);\r\n\tgl_FragColor = vec4(result, 1.0);\r\n}\r\n",
        "type": "x-shader/x-fragment"
    },
    "selection.frag": {
        "source": "precision highp float;\r\n\r\nvarying vec2 v_texCoord;\r\nuniform sampler2D u_bitmask;\r\n\r\nvoid main() {\r\n    float mask = texture2D(u_bitmask, v_texCoord).a;\r\n\r\n    if (mask == 0.0) {\r\n    discard;\r\n    }\r\n\r\n    gl_FragColor = vec4(0.3, 0.6, 0.8, 1.0);\r\n}\r\n",
        "type": "x-shader/x-fragment"
    },
    "sepia.frag": {
        "source": "precision mediump float;\r\n\r\nconst vec3 gMonoMult = vec3(0.299, 0.587, 0.114);\r\n\r\nuniform float u_depth;\r\nuniform float u_intensity;\r\nuniform sampler2D u_texture;\r\nvarying vec2 v_texCoord;\r\n\r\nvoid main() {\r\n\tvec4 texColor = texture2D(u_texture, v_texCoord);\r\n\tvec3 luma = vec3(dot(texColor.xyz, gMonoMult));\r\n\r\n\tgl_FragColor = vec4(luma + vec3(u_depth * 2, u_depth, - u_intensity), 1.0);\r\n}\r\n",
        "type": "x-shader/x-fragment"
    }
}
