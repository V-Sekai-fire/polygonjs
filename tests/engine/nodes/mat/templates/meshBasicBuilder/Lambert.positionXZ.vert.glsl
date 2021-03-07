
#include <common>



// /MAT/mesh_basic1/globals1
varying vec3 v_POLYGON_globals1_position;




#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {

	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>



	// /MAT/mesh_basic1/globals1
	v_POLYGON_globals1_position = vec3(position);
	
	// /MAT/mesh_basic1/output1
	vec3 transformed = position;
	vec3 objectNormal = normal;



	#include <skinbase_vertex>

	#ifdef USE_ENVMAP

	#include <morphnormal_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>

	#endif

	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>

	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>

}
