uniform float uCross;
uniform float sConst[8];
uniform float uLife;
uniform float uDrag;
uniform vec3 uFactors;
uniform float uFPS;
uniform float uParabola;


layout(location = 0) out vec4 position;
layout(location = 1) out vec4 velocity;

//////// Constants
	float damping = sConst[7];
	float a = sConst[0] * damping;
	float b = sConst[1] * damping;
	float c = sConst[2] * damping;
	float d = sConst[3] * damping;
	float e = sConst[4] * damping;
	float f = sConst[5] * damping;
	float k = sConst[6] * damping;	

//////// Parabola Function For Life
float parabola( float x, float k ) // fonction parabola pour interpolation size
{
    return pow( 4.0*x*(1.0-x), k );
}


void main()
{

//////// Sampling Texture	
    vec4 pos = texture(sTD2DInputs[0], vUV.st);
	vec4 vel = texture(sTD2DInputs[1], vUV.st);
    vec4 init = texture(sTD2DInputs[2], vUV.st);

//////// Definition Variables
	float x = pos.x;
    float y = pos.y;
    float z = pos.z;

//////// Equations Strange Attractors	
#include <formuleA>
	vec3 attractorA = vec3(dxA* uFactors.x, dyA* uFactors.y, dzA* uFactors.z) * dtA;
#include <formuleB>
	vec3 attractorB = vec3(dxB* uFactors.x, dyB* uFactors.y, dzB* uFactors.z) * dtB;
	
//////// Mix Ammounts Constants Attractors
	vec3 force = mix(attractorA, attractorB, uCross);
	pos.xyz += force * uDrag;
	vel.xyz = force;
	
//////// Life
    float life = pos.w;
    life -= uLife;
    if (life <= -uLife){
        life = 1.;
        pos.xyz = init.xyz;
    }
//////// Size en rapport avec Life
    float size = parabola(1.0- life , uParabola);

	position = vec4(pos.xyz, life);
    velocity = vec4(vel.xyz , size);
}