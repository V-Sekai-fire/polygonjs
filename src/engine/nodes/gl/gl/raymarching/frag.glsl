precision highp float;
precision highp int;

// --- applyMaterial constants definition
uniform int MAX_STEPS;
uniform float MAX_DIST;
uniform float SURF_DIST;
uniform float NORMALS_BIAS;
uniform vec3 CENTER;
#define ZERO 0

#include <common>
#include <lightmap_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <lights_physical_pars_fragment>



// uniform vec3 u_BoundingBoxMin;
// uniform vec3 u_BoundingBoxMax;


varying vec3 vPw;

#if NUM_SPOT_LIGHTS > 0
	struct SpotLightRayMarching {
		vec3 worldPos;
		vec3 direction;
	};
	uniform SpotLightRayMarching spotLightsRayMarching[ NUM_SPOT_LIGHTS ];
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLightRayMarching {
		vec3 direction;
	};
	uniform DirectionalLightRayMarching directionalLightsRayMarching[ NUM_DIR_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLightRayMarching {
		vec3 direction;
	};
	uniform HemisphereLightRayMarching hemisphereLightsRayMarching[ NUM_HEMI_LIGHTS ];
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLightRayMarching {
		vec3 worldPos;
	};
	uniform PointLightRayMarching pointLightsRayMarching[ NUM_POINT_LIGHTS ];
#endif


struct SDFContext {
	float d;
	int matId;
};

SDFContext DefaultSDFContext(){
	return SDFContext( 0.0, 0 );
}
int DefaultSDFMaterial(){
	return 0;
}



SDFContext GetDist(vec3 p) {
	SDFContext sdfContext = SDFContext(0.0, 0);

	// start GetDist builder body code
	

	return sdfContext;
}

SDFContext RayMarch(vec3 ro, vec3 rd, float side) {
	SDFContext dO = SDFContext(0.,0);

	#pragma unroll_loop_start
	for(int i=0; i<MAX_STEPS; i++) {
		vec3 p = ro + rd*dO.d;
		SDFContext sdfContext = GetDist(p);
		dO.d += sdfContext.d * side;
		dO.matId = sdfContext.matId;
		if(dO.d>MAX_DIST || abs(sdfContext.d)<SURF_DIST) break;
	}
	#pragma unroll_loop_end

	return dO;
}

vec3 GetNormal(vec3 p) {
	SDFContext sdfContext = GetDist(p);
	vec2 e = vec2(NORMALS_BIAS, 0);

	vec3 n = sdfContext.d - vec3(
		GetDist(p-e.xyy).d,
		GetDist(p-e.yxy).d,
		GetDist(p-e.yyx).d);

	return normalize(n);
}
vec3 GetLight(vec3 p, vec3 n) {
	vec3 dif = vec3(0.,0.,0.);
	#if NUM_SPOT_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_HEMI_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_RECT_AREA_LIGHTS > 0
		GeometricContext geometry;
		geometry.position = p;
		geometry.normal = n;
		// geometry.viewDir = rayDir;

		// vec4 mvPosition = vec4( p, 1.0 );
		// mvPosition = modelViewMatrix * mvPosition;
		// vec3 vViewPosition = - mvPosition.xyz;
		// geometry.position = p;
		// geometry.normal = n;
		// geometry.viewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( cameraPosition - p );

		IncidentLight directLight;
		ReflectedLight reflectedLight;
		vec3 lightPos,lightCol,lightDir, l;
		vec3 lighDif;
		SDFContext sdfContext;
		#if NUM_SPOT_LIGHTS > 0
			SpotLightRayMarching spotLightRayMarching;
			SpotLight spotLight;
			#pragma unroll_loop_start
			for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
				spotLightRayMarching = spotLightsRayMarching[ i ];
				spotLight = spotLights[ i ];
				spotLight.position = spotLightRayMarching.worldPos;
				spotLight.direction = spotLightRayMarching.direction;
				getSpotLightInfo( spotLight, geometry, directLight );
				
				lightPos = spotLightRayMarching.worldPos;
				lightCol = spotLight.color;
				l = normalize(lightPos-p);
				lighDif = directLight.color * clamp(dot(n, l), 0., 1.);
				sdfContext = RayMarch(p+n*SURF_DIST*2., l, 1.);
				if(sdfContext.d<length(lightPos-p)) lighDif *= .0;

				dif += lighDif;
			}
			#pragma unroll_loop_end
		#endif
		#if NUM_DIR_LIGHTS > 0
			DirectionalLightRayMarching directionalLightRayMarching;
			DirectionalLight directionalLight;
			#pragma unroll_loop_start
			for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
				directionalLightRayMarching = directionalLightsRayMarching[ i ];
				directionalLight = directionalLights[ i ];
				lightDir = directionalLightRayMarching.direction;
				lightCol = directionalLight.color;
				l = lightDir;
				lighDif = lightCol * clamp(dot(n, l), 0., 1.);
				sdfContext = RayMarch(p+n*SURF_DIST*2., l, 1.);
				if(sdfContext.d<length(lightDir)) lighDif *= .0;

				dif += lighDif;
			}
			#pragma unroll_loop_end
		#endif
		

		#if ( NUM_HEMI_LIGHTS > 0 )

			#pragma unroll_loop_start
			HemisphereLight hemiLight;
			for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {

				hemiLight.skyColor = hemisphereLights[ i ].skyColor;
				hemiLight.groundColor = hemisphereLights[ i ].groundColor;
				hemiLight.direction = hemisphereLightsRayMarching[ i ].direction;
				dif += getHemisphereLightIrradiance( hemiLight, n );

			}
			#pragma unroll_loop_end

		#endif

		#if NUM_POINT_LIGHTS > 0
			PointLightRayMarching pointLightRayMarching;
			PointLight pointLight;
			#pragma unroll_loop_start
			for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
				pointLightRayMarching = pointLightsRayMarching[ i ];
				pointLight = pointLights[ i ];
				pointLight.position = pointLightRayMarching.worldPos;
				getPointLightInfo( pointLight, geometry, directLight );
				
				lightPos = pointLightRayMarching.worldPos;
				lightCol = pointLight.color;
				l = normalize(lightPos-p);
				lighDif = directLight.color * clamp(dot(n, l), 0., 1.);
				sdfContext = RayMarch(p+n*SURF_DIST*2., l, 1.);
				if(sdfContext.d<length(lightPos-p)) lighDif *= .0;

				dif += lighDif;
			}
			#pragma unroll_loop_end
		#endif

		// #if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )

		// 	RectAreaLight rectAreaLight;
		// 	AreaLightRayMarching areaLightRayMarching;
		// 	PhysicalMaterial material;
		// 	material.roughness = 1.;
		// 	material.specularColor = vec3(1.);
		// 	material.diffuseColor = vec3(1.);

		// 	#pragma unroll_loop_start
		// 	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		// 		areaLightRayMarching = areaLightsRayMarching[ i ];
		// 		rectAreaLight = rectAreaLights[ i ];
		// 		rectAreaLight.position = areaLightRayMarching.worldPos;

				
		// 		RE_Direct_RectArea( rectAreaLight, geometry, material, reflectedLight );
		// 	}
		// 	#pragma unroll_loop_end
		// 	dif += reflectedLight.directDiffuse;

		// #endif
	#endif

	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );

	// irradiance += getLightProbeIrradiance( lightProbe, geometry.normal );
	dif += irradiance;
	return dif;
}

// https://iquilezles.org/articles/rmshadows
float calcSoftshadow( in vec3 ro, in vec3 rd, float mint, float maxt, float k )
{
	float res = 1.0;
	float ph = 1e20;
	for( float t=mint; t<maxt; )
	{
		float h = GetDist(ro + rd*t).d;
		if( h<0.001 )
			return 0.0;
		float y = h*h/(2.0*ph);
		float d = sqrt(h*h-y*y);
		res = min( res, k*d/max(0.0,t-y) );
		ph = h;
		t += h;
	}
	return res;
}


// --- applyMaterial function definition



vec4 applyShading(vec3 rayOrigin, vec3 rayDir, SDFContext sdfContext){
	vec3 p = rayOrigin + rayDir * sdfContext.d;
	vec3 n = GetNormal(p);
	

	vec3 col = applyMaterial(p, n, rayDir, sdfContext.matId);
		
	// gamma
	col = pow( col, vec3(0.4545) ); 
	return vec4(col, 1.);
}

void main()	{

	vec3 rayDir = normalize(vPw - cameraPosition);
	vec3 rayOrigin = cameraPosition - CENTER;

	SDFContext sdfContext = RayMarch(rayOrigin, rayDir, 1.);

	gl_FragColor = vec4(0.);
	if( sdfContext.d >= MAX_DIST ){ discard; }
	gl_FragColor = applyShading(rayOrigin, rayDir, sdfContext);
}