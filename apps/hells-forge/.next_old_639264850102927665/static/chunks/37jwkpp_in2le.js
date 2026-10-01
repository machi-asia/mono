(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,68750,e=>{"use strict";var t=e.i(74135),r=e.i(31320);let i={};e.s(["getTextureBatchBindGroup",0,function(e,a,n){let s=0x811c9dc5;for(let t=0;t<a;t++)s^=e[t].uid,s=Math.imul(s,0x1000193)>>>0;return i[s]||function(e,a,n,s){let o={},l=0;for(let t=0;t<s;t++){let i=t<a?e[t]:r.Texture.EMPTY.source;o[l++]=i.source,o[l++]=i.style}let u=new t.BindGroup(o);return i[n]=u,u}(e,a,s,n)}])},87323,18102,96108,28028,45284,e=>{"use strict";var t,r=e.i(24314);class i{constructor(e){"number"==typeof e?this.rawBinaryData=new ArrayBuffer(e):e instanceof Uint8Array?this.rawBinaryData=e.buffer:this.rawBinaryData=e,this.uint32View=new Uint32Array(this.rawBinaryData),this.float32View=new Float32Array(this.rawBinaryData),this.size=this.rawBinaryData.byteLength}get int8View(){return this._int8View||(this._int8View=new Int8Array(this.rawBinaryData)),this._int8View}get uint8View(){return this._uint8View||(this._uint8View=new Uint8Array(this.rawBinaryData)),this._uint8View}get int16View(){return this._int16View||(this._int16View=new Int16Array(this.rawBinaryData)),this._int16View}get int32View(){return this._int32View||(this._int32View=new Int32Array(this.rawBinaryData)),this._int32View}get float64View(){return this._float64Array||(this._float64Array=new Float64Array(this.rawBinaryData)),this._float64Array}get bigUint64View(){return this._bigUint64Array||(this._bigUint64Array=new BigUint64Array(this.rawBinaryData)),this._bigUint64Array}view(e){return this[`${e}View`]}destroy(){this.rawBinaryData=null,this.uint32View=null,this.float32View=null,this.uint16View=null,this._int8View=null,this._uint8View=null,this._int16View=null,this._int32View=null,this._float64Array=null,this._bigUint64Array=null}static sizeOf(e){switch(e){case"int8":case"uint8":return 1;case"int16":case"uint16":return 2;case"int32":case"uint32":case"float32":return 4;default:throw Error(`${e} isn't a valid view type`)}}}var a=e.i(49864),n=e.i(48446);function s(e,t,r,i){if(r??(r=0),i??(i=Math.min(e.byteLength-r,t.byteLength)),7&r||7&i)if(3&r||3&i)new Uint8Array(t).set(new Uint8Array(e,r,i));else{let a=i/4;new Float32Array(t,0,a).set(new Float32Array(e,r,a))}else{let a=i/8;new Float64Array(t,0,a).set(new Float64Array(e,r,a))}}e.s(["fastCopy",0,s],18102);let o={normal:"normal-npm",add:"add-npm",screen:"screen-npm"};var l=((t=l||{})[t.DISABLED=0]="DISABLED",t[t.RENDERING_MASK_ADD=1]="RENDERING_MASK_ADD",t[t.MASK_ACTIVE=2]="MASK_ACTIVE",t[t.INVERSE_MASK_ACTIVE=3]="INVERSE_MASK_ACTIVE",t[t.RENDERING_MASK_REMOVE=4]="RENDERING_MASK_REMOVE",t[t.NONE=5]="NONE",t);function u(e,t){return"no-premultiply-alpha"===t.alphaMode&&o[e]||e}e.s(["BLEND_TO_NPM",0,o,"STENCIL_MODES",0,l],96108);var h=e.i(29281);function c(e,t){if(0===e)throw Error("Invalid value of `0` passed to `checkMaxIfStatementsInShader`");let r=t.createShader(t.FRAGMENT_SHADER);try{for(;;){let i="precision mediump float;\nvoid main(void){\nfloat test = 0.1;\n%forloop%\ngl_FragColor = vec4(0.0);\n}".replace(/%forloop%/gi,function(e){let t="";for(let r=0;r<e;++r)r>0&&(t+="\nelse "),r<e-1&&(t+=`if(test == ${r}.0){}`);return t}(e));if(t.shaderSource(r,i),t.compileShader(r),t.getShaderParameter(r,t.COMPILE_STATUS))break;e=e/2|0}}finally{t.deleteShader(r)}return e}e.s(["checkMaxIfStatementsInShader",0,c],28028);let d=null;class f{constructor(){this.ids=Object.create(null),this.textures=[],this.count=0}clear(){for(let e=0;e<this.count;e++){let t=this.textures[e];this.textures[e]=null,this.ids[t.uid]=null}this.count=0}}class m{constructor(){this.renderPipeId="batch",this.action="startBatch",this.start=0,this.size=0,this.textures=new f,this.blendMode="normal",this.topology="triangle-strip",this.canBundle=!0}destroy(){this.textures=null,this.gpuBindGroup=null,this.bindGroup=null,this.batcher=null,this.elements=null}}let p=[],g=0;function x(){return g>0?p[--g]:new m}function v(e){e.elements=null,p[g++]=e}n.GlobalResourceRegistry.register({clear:()=>{if(p.length>0)for(let e of p)e&&e.destroy();p.length=0,g=0}});let b=0,_=class e{constructor(t){this.uid=(0,r.uid)("batcher"),this.dirty=!0,this.batchIndex=0,this.batches=[],this._elements=[],(t={...e.defaultOptions,...t}).maxTextures||((0,a.deprecation)("v8.8.0","maxTextures is a required option for Batcher now, please pass it in the options"),t.maxTextures=function(){if(d)return d;let e=(0,h.getTestContext)();return d=c(d=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),e),e.getExtension("WEBGL_lose_context")?.loseContext(),d}());const{maxTextures:n,attributesInitialSize:s,indicesInitialSize:o}=t;this.attributeBuffer=new i(4*s),this.indexBuffer=new Uint16Array(o),this.maxTextures=n}begin(){this.elementSize=0,this.elementStart=0,this.indexSize=0,this.attributeSize=0;for(let e=0;e<this.batchIndex;e++)v(this.batches[e]);this.batchIndex=0,this._batchIndexStart=0,this._batchIndexSize=0,this.dirty=!0}add(e){this._elements[this.elementSize++]=e,e._indexStart=this.indexSize,e._attributeStart=this.attributeSize,e._batcher=this,this.indexSize+=e.indexSize,this.attributeSize+=e.attributeSize*this.vertexSize}checkAndUpdateTexture(e,t){let r=e._batch.textures.ids[t._source.uid];return(!!r||0===r)&&(e._textureId=r,e.texture=t,!0)}updateElement(e){this.dirty=!0;let t=this.attributeBuffer;e.packAsQuad?this.packQuadAttributes(e,t.float32View,t.uint32View,e._attributeStart,e._textureId):this.packAttributes(e,t.float32View,t.uint32View,e._attributeStart,e._textureId)}break(e){let t=this._elements;if(!t[this.elementStart])return;let r=x(),i=r.textures;i.clear();let a=t[this.elementStart],n=u(a.blendMode,a.texture._source),s=a.topology;4*this.attributeSize>this.attributeBuffer.size&&this._resizeAttributeBuffer(4*this.attributeSize),this.indexSize>this.indexBuffer.length&&this._resizeIndexBuffer(this.indexSize);let o=this.attributeBuffer.float32View,l=this.attributeBuffer.uint32View,h=this.indexBuffer,c=this._batchIndexSize,d=this._batchIndexStart,f="startBatch",m=[],p=this.maxTextures;for(let a=this.elementStart;a<this.elementSize;++a){let g=t[a];t[a]=null;let v=g.texture._source,_=u(g.blendMode,v),y=n!==_||s!==g.topology;if(v._batchTick===b&&!y){g._textureId=v._textureBindLocation,c+=g.indexSize,g.packAsQuad?(this.packQuadAttributes(g,o,l,g._attributeStart,g._textureId),this.packQuadIndex(h,g._indexStart,g._attributeStart/this.vertexSize)):(this.packAttributes(g,o,l,g._attributeStart,g._textureId),this.packIndex(g,h,g._indexStart,g._attributeStart/this.vertexSize)),g._batch=r,m.push(g);continue}v._batchTick=b,(i.count>=p||y)&&(this._finishBatch(r,d,c-d,i,n,s,e,f,m),f="renderBatch",d=c,n=_,s=g.topology,(i=(r=x()).textures).clear(),m=[],++b),g._textureId=v._textureBindLocation=i.count,i.ids[v.uid]=i.count,i.textures[i.count++]=v,g._batch=r,m.push(g),c+=g.indexSize,g.packAsQuad?(this.packQuadAttributes(g,o,l,g._attributeStart,g._textureId),this.packQuadIndex(h,g._indexStart,g._attributeStart/this.vertexSize)):(this.packAttributes(g,o,l,g._attributeStart,g._textureId),this.packIndex(g,h,g._indexStart,g._attributeStart/this.vertexSize))}i.count>0&&(this._finishBatch(r,d,c-d,i,n,s,e,f,m),d=c,++b),this.elementStart=this.elementSize,this._batchIndexStart=d,this._batchIndexSize=c}_finishBatch(e,t,r,i,a,n,s,o,l){e.gpuBindGroup=null,e.bindGroup=null,e.action=o,e.batcher=this,e.textures=i,e.blendMode=a,e.topology=n,e.start=t,e.size=r,e.elements=l,++b,this.batches[this.batchIndex++]=e,s.add(e)}finish(e){this.break(e)}ensureAttributeBuffer(e){4*e<=this.attributeBuffer.size||this._resizeAttributeBuffer(4*e)}ensureIndexBuffer(e){e<=this.indexBuffer.length||this._resizeIndexBuffer(e)}_resizeAttributeBuffer(e){let t=new i(Math.max(e,2*this.attributeBuffer.size));s(this.attributeBuffer.rawBinaryData,t.rawBinaryData),this.attributeBuffer=t}_resizeIndexBuffer(e){let t=this.indexBuffer,r=Math.max(e,1.5*t.length);r+=r%2;let i=r>65535?new Uint32Array(r):new Uint16Array(r);if(i.BYTES_PER_ELEMENT!==t.BYTES_PER_ELEMENT)for(let e=0;e<t.length;e++)i[e]=t[e];else s(t.buffer,i.buffer);this.indexBuffer=i}packQuadIndex(e,t,r){e[t]=r+0,e[t+1]=r+1,e[t+2]=r+2,e[t+3]=r+0,e[t+4]=r+2,e[t+5]=r+3}packIndex(e,t,r,i){let a=e.indices,n=e.indexSize,s=e.indexOffset,o=e.attributeOffset;for(let e=0;e<n;e++)t[r++]=i+a[e+s]-o}destroy(e={}){if(null!==this.batches){for(let e=0;e<this.batchIndex;e++)v(this.batches[e]);this.batches=null,this.geometry.destroy(!0),this.geometry=null,e.shader&&(this.shader?.destroy(),this.shader=null);for(let e=0;e<this._elements.length;e++)this._elements[e]&&(this._elements[e]._batch=null);this._elements=null,this.indexBuffer=null,this.attributeBuffer.destroy(),this.attributeBuffer=null}}};_.defaultOptions={maxTextures:null,attributesInitialSize:4,indicesInitialSize:6},e.s(["Batcher",0,_],87323);var y=e.i(85465),w=e.i(64957),S=e.i(60406);let I=new Float32Array(1),C=new Uint32Array(1);class T extends S.Geometry{constructor(){const e=new y.Buffer({data:I,label:"attribute-batch-buffer",usage:w.BufferUsage.VERTEX|w.BufferUsage.COPY_DST,shrinkToFit:!1});super({attributes:{aPosition:{buffer:e,format:"float32x2",stride:24,offset:0},aUV:{buffer:e,format:"float32x2",stride:24,offset:8},aColor:{buffer:e,format:"unorm8x4",stride:24,offset:16},aTextureIdAndRound:{buffer:e,format:"uint16x2",stride:24,offset:20}},indexBuffer:new y.Buffer({data:C,label:"index-batch-buffer",usage:w.BufferUsage.INDEX|w.BufferUsage.COPY_DST,shrinkToFit:!1})})}}e.s(["BatchGeometry",0,T],45284)},97828,e=>{"use strict";var t=e.i(47760),r=e.i(87323),i=e.i(45284),a=e.i(81491),n=e.i(68372),s=e.i(94111),o=e.i(55443),l=e.i(77953),u=e.i(65654);class h extends u.Shader{constructor(e){super({glProgram:(0,a.compileHighShaderGlProgram)({name:"batch",bits:[n.colorBitGl,(0,s.generateTextureBatchBitGl)(e),o.roundPixelsBitGl]}),gpuProgram:(0,a.compileHighShaderGpuProgram)({name:"batch",bits:[n.colorBit,(0,s.generateTextureBatchBit)(e),o.roundPixelsBit]}),resources:{batchSamplers:(0,l.getBatchSamplersUniformGroup)(e)}}),this.maxTextures=e}}let c=null,d=class e extends r.Batcher{constructor(t){super(t),this.geometry=new i.BatchGeometry,this.name=e.extension.name,this.vertexSize=6,c??(c=new h(t.maxTextures)),this.shader=c}packAttributes(e,t,r,i,a){let n=a<<16|65535&e.roundPixels,s=e.transform,o=s.a,l=s.b,u=s.c,h=s.d,c=s.tx,d=s.ty,{positions:f,uvs:m}=e,p=e.color,g=e.attributeOffset,x=g+e.attributeSize;for(let e=g;e<x;e++){let a=2*e,s=f[a],g=f[a+1];t[i++]=o*s+u*g+c,t[i++]=h*g+l*s+d,t[i++]=m[a],t[i++]=m[a+1],r[i++]=p,r[i++]=n}}packQuadAttributes(e,t,r,i,a){let n=e.texture,s=e.transform,o=s.a,l=s.b,u=s.c,h=s.d,c=s.tx,d=s.ty,f=e.bounds,m=f.maxX,p=f.minX,g=f.maxY,x=f.minY,v=n.uvs,b=e.color,_=a<<16|65535&e.roundPixels;t[i+0]=o*p+u*x+c,t[i+1]=h*x+l*p+d,t[i+2]=v.x0,t[i+3]=v.y0,r[i+4]=b,r[i+5]=_,t[i+6]=o*m+u*x+c,t[i+7]=h*x+l*m+d,t[i+8]=v.x1,t[i+9]=v.y1,r[i+10]=b,r[i+11]=_,t[i+12]=o*m+u*g+c,t[i+13]=h*g+l*m+d,t[i+14]=v.x2,t[i+15]=v.y2,r[i+16]=b,r[i+17]=_,t[i+18]=o*p+u*g+c,t[i+19]=h*g+l*p+d,t[i+20]=v.x3,t[i+21]=v.y3,r[i+22]=b,r[i+23]=_}_updateMaxTextures(e){this.shader.maxTextures!==e&&(c=new h(e),this.shader=c)}destroy(){this.shader=null,super.destroy()}};d.extension={type:[t.ExtensionType.Batcher],name:"default"},e.s(["DefaultBatcher",0,d],97828)},81491,68372,94111,55443,e=>{"use strict";var t=e.i(81107),r=e.i(27076),i=e.i(85830);function a(e,t,r){if(e)for(let a in e){let n=t[a.toLocaleLowerCase()];if(n){let t=e[a];"header"===a&&(t=t.replace(/@in\s+[^;]+;\s*/g,"").replace(/@out\s+[^;]+;\s*/g,"")),r&&n.push(`//----${r}----//`),n.push(t)}else(0,i.warn)(`${a} placement hook does not exist in shader`)}}let n=/\{\{(.*?)\}\}/g;function s(e){let t={};return(e.match(n)?.map(e=>e.replace(/[{()}]/g,""))??[]).forEach(e=>{t[e]=[]}),t}function o(e,t){let r,i=/@in\s+([^;]+);/g;for(;null!==(r=i.exec(e));)t.push(r[1])}function l(e,t,r=!1){let i=[];o(t,i),e.forEach(e=>{e.header&&o(e.header,i)}),r&&i.sort();let a=i.map((e,t)=>`       @location(${t}) ${e},`).join("\n"),n=t.replace(/@in\s+[^;]+;\s*/g,"");return n.replace("{{in}}",`
${a}
`)}function u(e,t){let r,i=/@out\s+([^;]+);/g;for(;null!==(r=i.exec(e));)t.push(r[1])}function h(e,t){let r=e;for(let e in t){let i=t[e];r=i.join("\n").length?r.replace(`{{${e}}}`,`//-----${e} START-----//
${i.join("\n")}
//----${e} FINISH----//`):r.replace(`{{${e}}}`,"")}return r}let c=Object.create(null),d=new Map,f=0;function m(e,t){return t.map(e=>(d.has(e)||d.set(e,f++),d.get(e))).sort((e,t)=>e-t).join("-")+e.vertex+e.fragment}function p(e,t,r){let i=s(e),n=s(t);return r.forEach(e=>{a(e.vertex,i,e.name),a(e.fragment,n,e.name)}),{vertex:h(e,i),fragment:h(t,n)}}let g=`
    @in aPosition: vec2<f32>;
    @in aUV: vec2<f32>;

    @out @builtin(position) vPosition: vec4<f32>;
    @out vUV : vec2<f32>;
    @out vColor : vec4<f32>;

    {{header}}

    struct VSOutput {
        {{struct}}
    };

    @vertex
    fn main( {{in}} ) -> VSOutput {

        var worldTransformMatrix = globalUniforms.uWorldTransformMatrix;
        var modelMatrix = mat3x3<f32>(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0
          );
        var position = aPosition;
        var uv = aUV;

        {{start}}

        vColor = vec4<f32>(1., 1., 1., 1.);

        {{main}}

        vUV = uv;

        var modelViewProjectionMatrix = globalUniforms.uProjectionMatrix * worldTransformMatrix * modelMatrix;

        vPosition =  vec4<f32>((modelViewProjectionMatrix *  vec3<f32>(position, 1.0)).xy, 0.0, 1.0);

        vColor *= globalUniforms.uWorldColorAlpha;

        {{end}}

        {{return}}
    };
`,x=`
    @in vUV : vec2<f32>;
    @in vColor : vec4<f32>;

    {{header}}

    @fragment
    fn main(
        {{in}}
      ) -> @location(0) vec4<f32> {

        {{start}}

        var outColor:vec4<f32>;

        {{main}}

        var finalColor:vec4<f32> = outColor * vColor;

        {{end}}

        return finalColor;
      };
`,v=`
    in vec2 aPosition;
    in vec2 aUV;

    out vec4 vColor;
    out vec2 vUV;

    {{header}}

    void main(void){

        mat3 worldTransformMatrix = uWorldTransformMatrix;
        mat3 modelMatrix = mat3(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0
          );
        vec2 position = aPosition;
        vec2 uv = aUV;

        {{start}}

        vColor = vec4(1.);

        {{main}}

        vUV = uv;

        mat3 modelViewProjectionMatrix = uProjectionMatrix * worldTransformMatrix * modelMatrix;

        gl_Position = vec4((modelViewProjectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);

        vColor *= uWorldColorAlpha;

        {{end}}
    }
`,b=`

    in vec4 vColor;
    in vec2 vUV;

    out vec4 finalColor;

    {{header}}

    void main(void) {

        {{start}}

        vec4 outColor;

        {{main}}

        finalColor = outColor * vColor;

        {{end}}
    }
`,_={name:"global-uniforms-bit",vertex:{header:`
        struct GlobalUniforms {
            uProjectionMatrix:mat3x3<f32>,
            uWorldTransformMatrix:mat3x3<f32>,
            uWorldColorAlpha: vec4<f32>,
            uResolution: vec2<f32>,
        }

        @group(0) @binding(0) var<uniform> globalUniforms : GlobalUniforms;
        `}},y={name:"global-uniforms-bit",vertex:{header:`
          uniform mat3 uProjectionMatrix;
          uniform mat3 uWorldTransformMatrix;
          uniform vec4 uWorldColorAlpha;
          uniform vec2 uResolution;
        `}};e.s(["compileHighShaderGlProgram",0,function({bits:e,name:r}){return new t.GlProgram({name:r,...function({template:e,bits:t}){let r=m(e,t);return c[r]||(c[r]=p(e.vertex,e.fragment,t)),c[r]}({template:{vertex:v,fragment:b},bits:[y,...e]})})},"compileHighShaderGpuProgram",0,function({bits:e,name:t}){let i=function({template:e,bits:t}){let r=m(e,t);if(c[r])return c[r];let{vertex:i,fragment:a}=function(e,t){var r;let i,a,n,s,o,h=t.map(e=>e.vertex).filter(e=>!!e),c=t.map(e=>e.fragment).filter(e=>!!e),d=l(h,e.vertex,!0);return i=[],u(r=d,i),h.forEach(e=>{e.header&&u(e.header,i)}),a=0,n=i.sort().map(e=>e.indexOf("builtin")>-1?e:`@location(${a++}) ${e}`).join(",\n"),s=i.sort().map(e=>`       var ${e.replace(/@.*?\s+/g,"")};`).join("\n"),o=`return VSOutput(
            ${i.sort().map(e=>{let t;return` ${(t=/\b(\w+)\s*:/g.exec(e))?t[1]:""}`}).join(",\n")});`,{vertex:d=r.replace(/@out\s+[^;]+;\s*/g,"").replace("{{struct}}",`
${n}
`).replace("{{start}}",`
${s}
`).replace("{{return}}",`
${o}
`),fragment:l(c,e.fragment,!0)}}(e,t);return c[r]=p(i,a,t),c[r]}({template:{fragment:x,vertex:g},bits:[_,...e]});return r.GpuProgram.from({name:t,vertex:{source:i.vertex,entryPoint:"main"},fragment:{source:i.fragment,entryPoint:"main"}})}],81491);let w={name:"color-bit",vertex:{header:`
            @in aColor: vec4<f32>;
        `,main:`
            vColor *= vec4<f32>(aColor.rgb * aColor.a, aColor.a);
        `}},S={name:"color-bit",vertex:{header:`
            in vec4 aColor;
        `,main:`
            vColor *= vec4(aColor.rgb * aColor.a, aColor.a);
        `}};e.s(["colorBit",0,w,"colorBitGl",0,S],68372);let I={},C={};e.s(["generateTextureBatchBit",0,function(e){return I[e]||(I[e]={name:"texture-batch-bit",vertex:{header:`
                @in aTextureIdAndRound: vec2<u32>;
                @out @interpolate(flat) vTextureId : u32;
            `,main:`
                vTextureId = aTextureIdAndRound.y;
            `,end:`
                if(aTextureIdAndRound.x == 1)
                {
                    vPosition = vec4<f32>(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
                }
            `},fragment:{header:`
                @in @interpolate(flat) vTextureId: u32;

                ${function(e){let t=[];if(1===e)t.push("@group(1) @binding(0) var textureSource1: texture_2d<f32>;"),t.push("@group(1) @binding(1) var textureSampler1: sampler;");else{let r=0;for(let i=0;i<e;i++)t.push(`@group(1) @binding(${r++}) var textureSource${i+1}: texture_2d<f32>;`),t.push(`@group(1) @binding(${r++}) var textureSampler${i+1}: sampler;`)}return t.join("\n")}(e)}
            `,main:`
                var uvDx = dpdx(vUV);
                var uvDy = dpdy(vUV);

                ${function(e){let t=[];if(1===e)t.push("outColor = textureSampleGrad(textureSource1, textureSampler1, vUV, uvDx, uvDy);");else{t.push("switch vTextureId {");for(let r=0;r<e;r++)r===e-1?t.push("  default:{"):t.push(`  case ${r}:{`),t.push(`      outColor = textureSampleGrad(textureSource${r+1}, textureSampler${r+1}, vUV, uvDx, uvDy);`),t.push("      break;}");t.push("}")}return t.join("\n")}(e)}
            `}}),I[e]},"generateTextureBatchBitGl",0,function(e){return C[e]||(C[e]={name:"texture-batch-bit",vertex:{header:`
                in vec2 aTextureIdAndRound;
                out float vTextureId;

            `,main:`
                vTextureId = aTextureIdAndRound.y;
            `,end:`
                if(aTextureIdAndRound.x == 1.)
                {
                    gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
                }
            `},fragment:{header:`
                in float vTextureId;

                uniform sampler2D uTextures[${e}];

            `,main:`

                ${function(e){let t=[];for(let r=0;r<e;r++)r>0&&t.push("else"),r<e-1&&t.push(`if(vTextureId < ${r}.5)`),t.push("{"),t.push(`	outColor = texture(uTextures[${r}], vUV);`),t.push("}");return t.join("\n")}(e)}
            `}}),C[e]}],94111);let T={name:"round-pixels-bit",vertex:{header:`
            fn roundPixels(position: vec2<f32>, targetSize: vec2<f32>) -> vec2<f32>
            {
                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
            }
        `}},A={name:"round-pixels-bit",vertex:{header:`
            vec2 roundPixels(vec2 position, vec2 targetSize)
            {
                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
            }
        `}};e.s(["roundPixelsBit",0,T,"roundPixelsBitGl",0,A],55443)},61805,77718,e=>{"use strict";let t;var r=e.i(57471),i=e.i(27402),a=e.i(56881);function n(e){let t=i.DOMAdapter.get().createCanvas(6,1),r=t.getContext("2d");return r.fillStyle=e,r.fillRect(0,0,6,1),t}function s(){if(void 0!==t)return t;try{let e=n("#ff00ff"),r=n("#ffff00"),a=i.DOMAdapter.get().createCanvas(6,1).getContext("2d");a.globalCompositeOperation="multiply",a.drawImage(e,0,0),a.drawImage(r,2,0);let s=a.getImageData(2,0,1,1);if(s){let e=s.data;t=255===e[0]&&0===e[1]&&0===e[2]}else t=!1}catch(e){t=!1}return t}e.s(["canUseNewCanvasBlendModes",0,s],77718);let o={canvas:null,convertTintToImage:!1,cacheStepsPerColorChannel:8,canUseMultiply:s(),tintMethod:null,_canvasSourceCache:new WeakMap,_unpremultipliedCache:new WeakMap,getCanvasSource:e=>{let t=e.source,r=t?.resource;if(!r)return null;let a="premultiplied-alpha"===t.alphaMode,n=t.resourceWidth??t.pixelWidth,s=t.resourceHeight??t.pixelHeight,l=n!==t.pixelWidth||s!==t.pixelHeight;if(a){if((r instanceof HTMLCanvasElement||"u">typeof OffscreenCanvas&&r instanceof OffscreenCanvas)&&!l)return r;let e=o._unpremultipliedCache.get(t);if(e?.resourceId===t._resourceId)return e.canvas}if(r instanceof Uint8Array||r instanceof Uint8ClampedArray||r instanceof Int8Array||r instanceof Uint16Array||r instanceof Int16Array||r instanceof Uint32Array||r instanceof Int32Array||r instanceof Float32Array||r instanceof ArrayBuffer){let e=o._canvasSourceCache.get(t);if(e?.resourceId===t._resourceId)return e.canvas;let a=i.DOMAdapter.get().createCanvas(t.pixelWidth,t.pixelHeight),n=a.getContext("2d"),s=n.createImageData(t.pixelWidth,t.pixelHeight),l=s.data,u=r instanceof ArrayBuffer?new Uint8Array(r):new Uint8Array(r.buffer,r.byteOffset,r.byteLength);if("bgra8unorm"===t.format)for(let e=0;e<l.length&&e+3<u.length;e+=4)l[e]=u[e+2],l[e+1]=u[e+1],l[e+2]=u[e],l[e+3]=u[e+3];else l.set(u.subarray(0,l.length));return n.putImageData(s,0,0),o._canvasSourceCache.set(t,{canvas:a,resourceId:t._resourceId}),a}if(a){let e=i.DOMAdapter.get().createCanvas(t.pixelWidth,t.pixelHeight),a=e.getContext("2d",{willReadFrequently:!0});e.width=t.pixelWidth,e.height=t.pixelHeight,a.drawImage(r,0,0);let n=a.getImageData(0,0,e.width,e.height),s=n.data;for(let e=0;e<s.length;e+=4){let t=s[e+3];if(t>0){let r=255/t;s[e]=Math.min(255,s[e]*r+.5),s[e+1]=Math.min(255,s[e+1]*r+.5),s[e+2]=Math.min(255,s[e+2]*r+.5)}}return a.putImageData(n,0,0),o._unpremultipliedCache.set(t,{canvas:e,resourceId:t._resourceId}),e}if(l){let e=o._canvasSourceCache.get(t);if(e?.resourceId===t._resourceId)return e.canvas;let a=i.DOMAdapter.get().createCanvas(t.pixelWidth,t.pixelHeight),n=a.getContext("2d");return a.width=t.pixelWidth,a.height=t.pixelHeight,n.drawImage(r,0,0),o._canvasSourceCache.set(t,{canvas:a,resourceId:t._resourceId}),a}return r},getTintedCanvas:(e,t)=>{let a=e.texture,n=r.Color.shared.setValue(t).toHex(),s=a.tintCache||(a.tintCache={}),l=s[n],u=a.source._resourceId;if(l?.tintId===u)return l;let h=l&&"getContext"in l?l:i.DOMAdapter.get().createCanvas();if(o.tintMethod(a,t,h),h.tintId=u,o.convertTintToImage&&void 0!==h.toDataURL){let e=i.DOMAdapter.get().createImage();e.src=h.toDataURL(),e.tintId=u,s[n]=e}else s[n]=h;return s[n]},getTintedPattern:(e,t)=>{let a=r.Color.shared.setValue(t).toHex(),n=e.patternCache||(e.patternCache={}),s=e.source._resourceId,l=n[a];return l?.tintId===s||(o.canvas||(o.canvas=i.DOMAdapter.get().createCanvas()),o.tintMethod(e,t,o.canvas),(l=o.canvas.getContext("2d").createPattern(o.canvas,"repeat")).tintId=s,n[a]=l),l},applyPatternTransform:(e,t,r=!0)=>{if(!t||!e.setTransform)return;let i=globalThis.DOMMatrix;if(!i)return;let a=new i([t.a,t.b,t.c,t.d,t.tx,t.ty]);e.setTransform(r?a.inverse():a)},tintWithMultiply:(e,t,i)=>{let n=i.getContext("2d"),s=e.frame.clone(),l=e.source._resolution??e.source.resolution??1,u=e.rotate;s.x*=l,s.y*=l,s.width*=l,s.height*=l;let h=a.groupD8.isVertical(u),c=h?s.height:s.width,d=h?s.width:s.height;i.width=Math.ceil(c),i.height=Math.ceil(d),n.save(),0xffffff!==t&&(n.fillStyle=r.Color.shared.setValue(t).toHex(),n.fillRect(0,0,c,d),n.globalCompositeOperation="multiply");let f=o.getCanvasSource(e);f&&(u&&o._applyInverseRotation(n,u,s.width,s.height),n.drawImage(f,s.x,s.y,s.width,s.height,0,0,s.width,s.height),0xffffff!==t&&(n.globalCompositeOperation="destination-atop",n.drawImage(f,s.x,s.y,s.width,s.height,0,0,s.width,s.height))),n.restore()},tintWithOverlay:(e,t,i)=>{let n=i.getContext("2d"),s=e.frame.clone(),l=e.source._resolution??e.source.resolution??1,u=e.rotate;s.x*=l,s.y*=l,s.width*=l,s.height*=l;let h=a.groupD8.isVertical(u),c=h?s.height:s.width,d=h?s.width:s.height;i.width=Math.ceil(c),i.height=Math.ceil(d),n.save(),n.globalCompositeOperation="copy",n.fillStyle=r.Color.shared.setValue(t).toHex(),n.fillRect(0,0,c,d),n.globalCompositeOperation="destination-atop";let f=o.getCanvasSource(e);f&&(u&&o._applyInverseRotation(n,u,s.width,s.height),n.drawImage(f,s.x,s.y,s.width,s.height,0,0,s.width,s.height)),n.restore()},tintWithPerPixel:(e,t,r)=>{let i=r.getContext("2d"),n=e.frame.clone(),s=e.source._resolution??e.source.resolution??1,l=e.rotate;n.x*=s,n.y*=s,n.width*=s,n.height*=s;let u=a.groupD8.isVertical(l),h=u?n.height:n.width,c=u?n.width:n.height;r.width=Math.ceil(h),r.height=Math.ceil(c),i.save(),i.globalCompositeOperation="copy";let d=o.getCanvasSource(e);if(!d)return void i.restore();l&&o._applyInverseRotation(i,l,n.width,n.height),i.drawImage(d,n.x,n.y,n.width,n.height,0,0,n.width,n.height),i.restore();let f=t>>16&255,m=t>>8&255,p=255&t,g=i.getImageData(0,0,h,c),x=g.data;for(let e=0;e<x.length;e+=4)x[e]=x[e]*f/255,x[e+1]=x[e+1]*m/255,x[e+2]=x[e+2]*p/255;i.putImageData(g,0,0)},_applyInverseRotation:(e,t,r,i)=>{let n=a.groupD8.inv(t),s=a.groupD8.uX(n),o=a.groupD8.uY(n),l=a.groupD8.vX(n),u=a.groupD8.vY(n),h=-Math.min(0,s*r,l*i,s*r+l*i),c=-Math.min(0,o*r,u*i,o*r+u*i);e.transform(s,o,l,u,h,c)}};o.tintMethod=o.canUseMultiply?o.tintWithMultiply:o.tintWithPerPixel,e.s(["canvasUtils",0,o],61805)},77953,e=>{"use strict";var t=e.i(32543);let r={};e.s(["getBatchSamplersUniformGroup",0,function(e){let i=r[e];if(i)return i;let a=new Int32Array(e);for(let t=0;t<e;t++)a[t]=t;return r[e]=new t.UniformGroup({uTextures:{value:a,type:"i32",size:e}},{isStatic:!0})}])},2351,55364,69510,3197,e=>{"use strict";let t;var r,i=e.i(57471),a=e.i(47760);let n=[];async function s(e){if(!e)for(let e=0;e<n.length;e++){let t=n[e];if(t.value.test())return void await t.value.load()}}a.extensions.handleByNamedList(a.ExtensionType.Environment,n);var o=e.i(50147);function l(){if("boolean"==typeof t)return t;try{let e=Function("param1","param2","param3","return param1[param2] === param3;");t=!0===e({a:"b"},"a","b")}catch(e){t=!1}return t}e.s(["unsafeEvalSupported",0,l],55364);var u=e.i(24314),h=e.i(49864),c=e.i(48446),d=((r=d||{})[r.NONE=0]="NONE",r[r.COLOR=16384]="COLOR",r[r.STENCIL=1024]="STENCIL",r[r.DEPTH=256]="DEPTH",r[r.COLOR_DEPTH=16640]="COLOR_DEPTH",r[r.COLOR_STENCIL=17408]="COLOR_STENCIL",r[r.DEPTH_STENCIL=1280]="DEPTH_STENCIL",r[r.ALL=17664]="ALL",r);e.s(["CLEAR",0,d],69510);class f{constructor(e){this.items=[],this._name=e}emit(e,t,r,i,a,n,s,o){let{name:l,items:u}=this;for(let h=0,c=u.length;h<c;h++)u[h][l](e,t,r,i,a,n,s,o);return this}add(e){return e[this._name]&&(this.remove(e),this.items.push(e)),this}remove(e){let t=this.items.indexOf(e);return -1!==t&&this.items.splice(t,1),this}contains(e){return -1!==this.items.indexOf(e)}removeAll(){return this.items.length=0,this}destroy(){this.removeAll(),this.items=null,this._name=null}get empty(){return 0===this.items.length}get name(){return this._name}}e.s(["SystemRunner",0,f],3197);var m=e.i(95932);let p=["init","destroy","contextChange","resolutionChange","resetState","renderEnd","renderStart","render","update","postrender","prerender"],g=class e extends m.default{constructor(e){super(),this.tick=0,this.uid=(0,u.uid)("renderer"),this.runners=Object.create(null),this.renderPipes=Object.create(null),this._initOptions={},this._systemsHash=Object.create(null),this.type=e.type,this.name=e.name,this.config=e;const t=[...p,...this.config.runners??[]];this._addRunners(...t),this._unsafeEvalCheck()}async init(t={}){let r=!0===t.skipExtensionImports||!1===t.manageImports;for(let e in await s(r),!r&&this.config.loaders&&await Promise.all(this.config.loaders.map(e=>e.value.load())),this._addSystems(this.config.systems),this._addPipes(this.config.renderPipes,this.config.renderPipeAdaptors),this._systemsHash)t={...this._systemsHash[e].constructor.defaultOptions,...t};t={...e.defaultOptions,...t},this._roundPixels=+!!t.roundPixels;for(let e=0;e<this.runners.init.items.length;e++)await this.runners.init.items[e].init(t);this._initOptions=t}render(e,t){this.tick++;let r=e;if(r instanceof o.Container&&(r={container:r},t&&((0,h.deprecation)(h.v8_0_0,"passing a second argument is deprecated, please use render options instead"),r.target=t.renderTexture)),r.target||(r.target=this.view.renderTarget),r.target===this.view.renderTarget&&(this._lastObjectRendered=r.container,r.clearColor??(r.clearColor=this.background.colorRgba),r.clear??(r.clear=this.background.clearBeforeRender)),r.clearColor){let e=Array.isArray(r.clearColor)&&4===r.clearColor.length;r.clearColor=e?r.clearColor:i.Color.shared.setValue(r.clearColor).toArray()}r.transform||(r.container.updateLocalTransform(),r.transform=r.container.localTransform),r.container.visible&&(r.container.enableRenderGroup(),this.runners.prerender.emit(r),this.runners.renderStart.emit(r),this.runners.render.emit(r),this.runners.renderEnd.emit(r),this.runners.postrender.emit(r))}resize(e,t,r){let i=this.view.resolution;this.view.resize(e,t,r),this.emit("resize",this.view.screen.width,this.view.screen.height,this.view.resolution),void 0!==r&&r!==i&&this.runners.resolutionChange.emit(r)}clear(e={}){e.target||(e.target=this.renderTarget.renderTarget),e.clearColor||(e.clearColor=this.background.colorRgba),e.clear??(e.clear=d.ALL);let{clear:t,clearColor:r,target:a,mipLevel:n,layer:s}=e;i.Color.shared.setValue(r??this.background.colorRgba),this.renderTarget.clear(a,t,i.Color.shared.toArray(),n??0,s??0)}get resolution(){return this.view.resolution}set resolution(e){this.view.resolution=e,this.runners.resolutionChange.emit(e)}get width(){return this.view.texture.frame.width}get height(){return this.view.texture.frame.height}get canvas(){return this.view.canvas}get lastObjectRendered(){return this._lastObjectRendered}get renderingToScreen(){return this.renderTarget.renderingToScreen}get screen(){return this.view.screen}_addRunners(...e){e.forEach(e=>{this.runners[e]=new f(e)})}_addSystems(e){let t;for(t in e){let r=e[t];this._addSystem(r.value,r.name)}}_addSystem(e,t){let r=new e(this);if(this[t])throw Error(`Whoops! The name "${t}" is already in use`);for(let e in this[t]=r,this._systemsHash[t]=r,this.runners)this.runners[e].add(r);return this}_addPipes(e,t){let r=t.reduce((e,t)=>(e[t.name]=t.value,e),{});e.forEach(e=>{let t=e.value,i=e.name,a=r[i];this.renderPipes[i]=new t(this,a?new a:null),this.runners.destroy.add(this.renderPipes[i])})}destroy(e=!1){this.runners.destroy.items.reverse(),this.runners.destroy.emit(e),(!0===e||"object"==typeof e&&e.releaseGlobalResources)&&c.GlobalResourceRegistry.release(),Object.values(this.runners).forEach(e=>{e.destroy()}),this._systemsHash=null,this.renderPipes=null,this.removeAllListeners()}generateTexture(e){return this.textureGenerator.generateTexture(e)}get roundPixels(){return!!this._roundPixels}_unsafeEvalCheck(){if(!l())throw Error("Current environment does not allow unsafe-eval, please use pixi.js/unsafe-eval module to enable support.")}resetState(){this.runners.resetState.emit()}};g.defaultOptions={resolution:1,failIfMajorPerformanceCaveat:!1,roundPixels:!1},e.s(["AbstractRenderer",0,g],2351)},16203,e=>{"use strict";var t=e.i(47760),r=e.i(95627);class i extends r.TextureSource{constructor(e){super(e),this.uploadMethodId="image",this.autoGarbageCollect=!0}static test(e){return globalThis.HTMLImageElement&&e instanceof HTMLImageElement||"u">typeof ImageBitmap&&e instanceof ImageBitmap||globalThis.VideoFrame&&e instanceof VideoFrame}}i.extension=t.ExtensionType.TextureSource,e.s(["ImageSource",0,i])},89506,e=>{"use strict";e.s(["color32BitToUniform",0,function(e,t,r){let i=(e>>24&255)/255;t[r++]=(255&e)/255*i,t[r++]=(e>>8&255)/255*i,t[r++]=(e>>16&255)/255*i,t[r++]=i}])},40766,e=>{"use strict";e.s(["BatchableSprite",0,class{constructor(){this.batcherName="default",this.topology="triangle-list",this.attributeSize=4,this.indexSize=6,this.packAsQuad=!0,this.roundPixels=0,this._attributeStart=0,this._batcher=null,this._batch=null}get blendMode(){return this.renderable.groupBlendMode}get color(){return this.renderable.groupColorAlpha}reset(){this.renderable=null,this.texture=null,this._batcher=null,this._batch=null,this.bounds=null}destroy(){this.reset()}}])},33219,e=>{"use strict";e.s(["GCManagedHash",0,class{constructor(e){this.items=Object.create(null);const{renderer:t,type:r,onUnload:i,priority:a,name:n}=e;this._renderer=t,t.gc.addResourceHash(this,"items",r,a??0),this._onUnload=i,this.name=n}add(e){return!this.items[e.uid]&&(this.items[e.uid]=e,e.once("unload",this.remove,this),e._gcLastUsed=this._renderer.gc.now,!0)}remove(e,...t){if(!this.items[e.uid])return;let r=e._gpuData[this._renderer.uid];r&&(this._onUnload?.(e,...t),e.off("unload",this.remove,this),r.destroy(),e._gpuData[this._renderer.uid]=null,this.items[e.uid]=null)}removeAll(...e){Object.values(this.items).forEach(t=>t&&this.remove(t,...e))}destroy(...e){this.removeAll(...e),this.items=Object.create(null),this._renderer=null,this._onUnload=null}}])},81834,76789,e=>{"use strict";var t=e.i(47760);e.i(95932);let r="8.21.0";e.s(["VERSION",0,r],76789);class i{static init(){globalThis.__PIXI_APP_INIT__?.(this,r)}static destroy(){}}i.extension=t.ExtensionType.Application;class a{constructor(e){this._renderer=e}init(){globalThis.__PIXI_RENDERER_INIT__?.(this._renderer,r)}destroy(){this._renderer=null}}a.extension={type:[t.ExtensionType.WebGLSystem,t.ExtensionType.WebGPUSystem],name:"initHook",priority:-10},e.s(["ApplicationInitHook",0,i,"RendererInitHook",0,a],81834)}]);