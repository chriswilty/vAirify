////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// define uniforms
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
uniform float uLayerOpacity;
uniform float uFrameWeight;
uniform float thisDataMin[12]; 
uniform float thisDataMax[12];
uniform float uUserMinValue;
uniform float uUserMaxValue;
uniform float colorMapIndex;
uniform float uVariableIndex;

uniform sampler2D thisDataTexture;
uniform sampler2D nextDataTexture;
uniform sampler2D colorMap;
uniform sampler2D lsmTexture;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// varying from vertex shader
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// define functions
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// convert float to color via colormap
vec4 applyColormap(float t, sampler2D colormap, float index){
    return(texture2D(colormap,vec2(t, index / 23.0 + 1.0 / 23.0 )));
}

// remap color range
float remap(float value, float inMin, float inMax, float outMin, float outMax) {
    return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

// Adjusted remap function to handle user-defined min and max values
float userRemap(float value) {
    if (value < 0.0) {
        return 0.5 * (value - uUserMinValue) / -uUserMinValue;
    } else {
        return 0.5 + 0.5 * value / uUserMaxValue;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// main program
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

void main()	{

float cmap_index = colorMapIndex;
float opacity_cutoff = 0.0;

float remapMin;
float remapMax;

if ( uVariableIndex == 1.0 ) { // AQI
    remapMin = 1.0;
    remapMax = 7.0;
} else if ( ( uVariableIndex == 2.0 ) || ( uVariableIndex == 3.0 ) ) { // PM10, PM2.5
    remapMin = 0.0;
    remapMax = 1000.0;
} else if ( uVariableIndex == 4.0 ) { // O3
    remapMin = 0.0;
    remapMax = 500.0;
} else if ( uVariableIndex == 5.0 ) { // NO2
    remapMin = 0.0;
    remapMax = 100.0;
} else if ( uVariableIndex == 6.0 ) { // SO2
    remapMin = 0.0;
    remapMax = 100.0;
} 


// convert relative bitmap value to absolute value for both frames
float thisFrameData = remap( 
    texture2D(
        thisDataTexture, 
        vUv
        ).r, 
    0.0, 
    1.0, 
    remapMin, 
    remapMax);

float nextFrameData = remap( 
    texture2D(
        nextDataTexture, 
        vUv
        ).r, 
    0.0, 
    1.0, 
    remapMin, 
    remapMax);

// interpolate between absolute values of both frames
float intData = mix(thisFrameData, nextFrameData, uFrameWeight);

// gl_FragColor = dataColor;
gl_FragColor = vec4(1.0);

vec3 color;

// Define colors for each range

// AQI
if ( uVariableIndex == 1.0 ) {
    if (intData >= 1.0 && intData < 2.0) {
        color = vec3(129., 237., 229.);
    } else if (intData >= 2.0 && intData < 3.0) {
        color = vec3(116.0, 201.0, 172.0);
    } else if (intData >= 3.0 && intData < 4.0) {
        color = vec3(238.0, 230.0, 97.0);
    } else if (intData >= 4.0 && intData < 5.0) {
        color = vec3(236.0, 94.0, 87.0);
    } else if (intData >= 5.0 && intData < 6.0) {
        color = vec3(137.0, 26.0, 52.0);
    } else if (intData >= 6.0 && intData < 7.0) {
        color = vec3(115.0, 40.0, 125.0);
    } else {
        color = vec3(0.0, 0.0, 0.0);
    }
} else if ( ( uVariableIndex == 2.0) || ( uVariableIndex == 3.0) ) {
    if (intData < 30.0) {
        color = vec3(255.0); // Red
    } else if (intData < 40.0) {
        color = vec3(233.0, 249.0, 188.0);
    } else if (intData < 50.0) {
        color = vec3(198.0, 255.0, 199.0);
    } else if (intData < 60.0) {
        color = vec3(144.0, 237.0, 169.0);
    } else if (intData < 80.0) {
        color = vec3(76.0, 180.0, 148.0); 
    } else if (intData < 100.0) {
        color = vec3(48.0, 155.0, 138.0); 
    } else if (intData < 150.0) {
        color = vec3(47.0, 137.0, 169.0);
    } else if (intData < 200.0) {
        color = vec3(16.0, 99.0, 164.0); 
    } else if (intData < 300.0) {
        color = vec3(13.0, 69.0, 126.0);
    } else if (intData < 500.0) {
        color = vec3(15.0, 26.0, 136.0);
    } else if (intData < 1000.0) {
        color = vec3(38.0, 2.0, 60.0);
    } else {
        color = vec3(0.0, 0.0, 0.0);
    }
} else if ( uVariableIndex == 4.0 ) {   // O3
    if (intData < 10.0) {
        color = vec3(144.0, 190.0, 228.0);
    } else if (intData < 20.0) {
        color = vec3(20.0, 145.0, 216.0);
    } else if (intData < 30.0) {
        color = vec3(15.0, 109.0, 179.0);
    } else if (intData < 40.0) {
        color = vec3(35.0, 79.0, 146.0);
    } else if (intData < 50.0) {
        color = vec3(37.0, 133.0, 100.0);
    } else if (intData < 60.0) {
        color = vec3(96.0, 168.0, 83.0);
    } else if (intData < 70.0) {
        color = vec3(157.0, 193.0, 99.0);
    } else if (intData < 80.0) {
        color = vec3(255.0,242.0, 148.0);
    } else if (intData < 90.0) {
        color = vec3(240.0, 203.0, 62.0);
    } else if (intData < 100.0) {
        color = vec3(229.0, 172.0, 59.0);
    } else if (intData < 120.0) {
        color = vec3(214.0, 124.0, 62.0);
    } else if (intData < 150.0) {
        color = vec3(196.0, 49.0, 50.0);
    } else {
        color = vec3(142.0, 25.0, 35.0);
    }
}

gl_FragColor = vec4(color/255., 1.0);

// overlay lsmTexture
vec4 lsmColor = texture2D(lsmTexture, vUv);

gl_FragColor = mix(vec4(0.,0.,0.,1.),gl_FragColor,lsmColor.r);

}