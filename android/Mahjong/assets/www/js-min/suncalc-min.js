/*
 Copyright (c) 2011, Vladimir Agafonkin
 SunCalc is a JavaScript library for calculating sun position and sunlight phases.
 https://github.com/mourner/suncalc
*/
(function(j){function o(a){return new Date((a+0.5-p)*q)}var j=typeof exports!=="undefined"?exports:j.SunCalc={},c=Math,d=c.PI/180,a=c.sin,i=c.cos,q=864E5,p=2440588,k=2451545,v=d*357.5291,w=d*0.98560028,r=9.0E-4,x=0.0053,y=-0.0069,z=d*1.9148,A=d*0.02,B=d*3.0E-4,C=d*102.9372,s=d*23.45,I=d*280.16,J=d*360.9856235,t=[[-0.83,"日出","日落"],[-0.3,"sunriseEnd","sunsetStart"],[-6,"dawn","dusk"],[-12,"nauticalDawn","nauticalDusk"],[-18,"nightEnd","night"],[10,"goldenHourEnd","goldenHour"]];j.addTime=function(a,
c,b){t.push([a,c,b])};j.getTimes=function(e,f,b){function h(b){b=c.acos((a(b)-a(j)*a(D))/(i(j)*i(D)));return k+r+(b+g)/(2*c.PI)+E+x*a(l)+y*a(2*u)}var g=d*-b,j=d*f,E=c.round(e.valueOf()/q-0.5+p-k-r-g/(2*c.PI)),e=k+r+(0+g)/(2*c.PI)+E,l=v+w*(e-k),f=z*a(l)+A*a(2*l)+B*a(3*l),u=l+C+f+c.PI,D=c.asin(a(u)*a(s)),e=e+x*a(l)+y*a(2*u),f={solarNoon:o(e)},F,m,n,G,H;for(b=0,F=t.length;b<F;b+=1)m=t[b],n=m[0],G=m[1],m=m[2],n=h(n*d),H=e-(n-e),f[G]=o(H),f[m]=o(n);return f};j.getPosition=function(e,f,b){b=d*-b;f*=d;var e=
e.valueOf()/q-0.5+p,h=v+w*(e-k),g=z*a(h)+A*a(2*h)+B*a(3*h),g=h+C+g+c.PI,h=c.asin(a(g)*a(s)),g=c.atan2(a(g)*i(s),i(g)),b=I+J*(e-k)-b-g;return{azimuth:c.atan2(a(b),i(b)*a(f)-c.tan(h)*i(f)),altitude:c.asin(a(f)*a(h)+i(f)*i(h)*i(b))}}})(this);


//,[-0.3,"sunriseEnd","sunsetStart"],[-6,"dawn","dusk"],[-12,"nauticalDawn","nauticalDusk"],[-18,"nightEnd","night"],[10,"goldenHourEnd","goldenHour"]