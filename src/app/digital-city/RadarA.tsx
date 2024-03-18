import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { AdditiveBlending, Color, DoubleSide, ShaderMaterial } from 'three'

interface Props {
  position: [number, number, number]
  size: number
  color: string
  radius: number
  speed: number
}

const RadarA = ({ position, size, color, radius, speed }: Props) => {
  const shaderRef = useRef<Partial<ShaderMaterial>>(null!)

  shaderRef.current = {
    transparent: true,
    blending: AdditiveBlending,
    depthWrite: false,
    side: DoubleSide,
    depthTest: true,
    vertexShader: `
      varying vec3 vPosition;
      void main() {
        vPosition = position;
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectionPosition = projectionMatrix * viewPosition;
        gl_Position = projectionPosition;
      }
      `,
    fragmentShader: `
      uniform float uRadius;
      uniform float uTime;
      uniform float uSpeed;
      uniform float uFollowWidth;
      varying vec3 vPosition;
      uniform vec3 ncolor;
      float calcAngle(vec3 oFrag){
        float fragAngle;
        const vec3 ox = vec3(1,0,0);
        float dianji = oFrag.x * ox.x + oFrag.z*ox.z;
        float oFrag_length = length(oFrag); // length是内置函数
        float ox_length = length(ox); // length是内置函数
        float yuxian = dianji / (oFrag_length * ox_length);
        fragAngle = acos(yuxian);
        fragAngle = degrees(fragAngle);
        if(oFrag.z > 0.0) {
          fragAngle = -fragAngle + 360.0;
        }
        float scanAngle = uTime * uSpeed - floor(uTime * uSpeed / 360.0) * 360.0;
        float angle = scanAngle - fragAngle;
        if(angle < 0.0){
          angle = angle + 360.0;
        }
        return angle;
      }
      void main() {
          // length内置函数，取向量的长度
        if(length(vPosition) == 0.0 || length(vPosition) > uRadius-2.0){
          gl_FragColor = vec4( ncolor, 1.0 );
        } else {
          float angle = calcAngle(vPosition);
          if(angle < uFollowWidth){
            // 尾焰区域
            float opacity =  1.0 - angle / uFollowWidth; 
            gl_FragColor = vec4( ncolor, 1.0 * opacity );  
          } else {
            // 其他位置的像素均为透明
            gl_FragColor = vec4( ncolor, 0.0 ); 
          }
        }
      }
      `,
    uniforms: {
      uSpeed: { value: speed },
      uRadius: { value: radius },
      uTime: {
        value: 0
      },
      uFollowWidth: { value: 300 },
      ncolor: { value: new Color(color) }
    }
  }

  // const [utime, setUtime] = useState(0)

  useFrame((_, delta) => {
    // timeDelta.current += delta
    console.log(shaderRef.current, 222)
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value += delta
    }
    // setUtime((prev) => (prev += delta))
  })

  return (
    <mesh position={position} rotation-x={(-Math.PI / 180) * 90}>
      <circleGeometry args={[size, 1000]} />
      <shaderMaterial
        ref={shaderRef}
        // transparent
        // blending={AdditiveBlending}
        // depthWrite={false}
        // depthTest={true}
        // side={DoubleSide}
        // vertexShader={`
        //   varying vec3 vPosition;
        //   void main() {
        //     vPosition = position;
        //     vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        //     vec4 viewPosition = viewMatrix * modelPosition;
        //     vec4 projectionPosition = projectionMatrix * viewPosition;
        //     gl_Position = projectionPosition;
        //   }
        // `}
        // fragmentShader={`
        //   uniform float uRadius;
        //   uniform float uTime;
        //   uniform float uSpeed;
        //   uniform float uFollowWidth;
        //   varying vec3 vPosition;
        //   uniform vec3 ncolor;
        //   float calcAngle(vec3 oFrag){
        //     float fragAngle;
        //     const vec3 ox = vec3(1,0,0);
        //     float dianji = oFrag.x * ox.x + oFrag.z*ox.z;
        //     float oFrag_length = length(oFrag); // length是内置函数
        //     float ox_length = length(ox); // length是内置函数
        //     float yuxian = dianji / (oFrag_length * ox_length);
        //     fragAngle = acos(yuxian);
        //     fragAngle = degrees(fragAngle);
        //     if(oFrag.z > 0.0) {
        //       fragAngle = -fragAngle + 360.0;
        //     }
        //     float scanAngle = uTime * uSpeed - floor(uTime * uSpeed / 360.0) * 360.0;
        //     float angle = scanAngle - fragAngle;
        //     if(angle < 0.0){
        //       angle = angle + 360.0;
        //     }
        //     return angle;
        //   }
        //   void main() {
        //       // length内置函数，取向量的长度
        //     if(length(vPosition) == 0.0 || length(vPosition) > uRadius-2.0){
        //       gl_FragColor = vec4( ncolor, 1.0 );
        //     } else {
        //       float angle = calcAngle(vPosition);
        //       if(angle < uFollowWidth){
        //         // 尾焰区域
        //         float opacity =  1.0 - angle / uFollowWidth;
        //         gl_FragColor = vec4( ncolor, 1.0 * opacity );
        //       } else {
        //         // 其他位置的像素均为透明
        //         gl_FragColor = vec4( ncolor, 0.0 );
        //       }
        //     }
        //   }
        // `}
        // uniforms={{
        //   uSpeed: {
        //     value: speed
        //   },
        //   uRadius: { value: radius },
        //   uTime: {
        //     value: 0
        //   },
        //   uFollowWidth: { value: 220 },
        //   ncolor: { value: new Color(color) }
        // }}
      />
      {/* <meshStandardMaterial color={color} /> */}
    </mesh>
  )
}

export default RadarA
