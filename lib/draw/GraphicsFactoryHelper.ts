import {Point, MathConsts} from "@awayjs/core";

import {CapsStyle} from "../draw/CapsStyle";

export class GraphicsFactoryHelper
{
	public static _tess_obj:any;


	public static isClockWiseXY(point1x:number, point1y:number, point2x:number, point2y:number, point3x:number, point3y:number):boolean
	{
		var num:number=(point1x - point2x) * (point3y - point2y) - (point1y - point2y) * (point3x - point2x);
		if(num < 0)
			return false;
		return true;
	}
	public static getSign(ax:number, ay:number, cx:number, cy:number, bx:number, by:number):number
	{
		return (ax - bx) * (cy - by) - (ay - by) * (cx - bx);
	}
	public static pointInTri(ax:number, ay:number, bx:number, by:number ,cx:number, cy:number, xx:number, xy:number):boolean
	{
		var b1:boolean = GraphicsFactoryHelper.getSign(ax, ay, xx, xy, bx, by) > 0;
		var b2:boolean = GraphicsFactoryHelper.getSign(bx, by, xx, xy, cx, cy) > 0;
		var b3:boolean = GraphicsFactoryHelper.getSign(cx, cy, xx, xy, ax, ay) > 0;
		return ((b1 == b2) && (b2 == b3));
	}
	public static getControlXForCurveX(a:number, c:number, b:number):number
	{
		return c;
	}
	public static getControlYForCurveY(a:number, c:number, b:number):number
	{
		return c;
	}
	public static drawPoint(startX:number,startY:number, vertices:Array<number>, curves:boolean):void
	{
		GraphicsFactoryHelper.addTriangle(startX-2, startY-2, startX+2, startY-2, startX+2, startY+2, 0, vertices, curves);
		GraphicsFactoryHelper.addTriangle(startX-2, startY-2, startX-2, startY+2, startX+2, startY+2, 0, vertices, curves);
	}
	public static drawElipse(x:number,y:number,width:number, height:number, vertices:Array<number>, startAngle:number, endAngle:number, stepAngle:number, curves:boolean):void
	{

		// todo: validate input / check edge cases
		var degreeTotal:number=endAngle-startAngle;
		var steps:number=degreeTotal/stepAngle;
		var x_last = x + width * Math.cos(startAngle* (Math.PI/180));
		var y_last = y + height * Math.sin(startAngle* (Math.PI/180));
		for(var i=1; i<=steps;i++){
			var x_tmp = x + width * Math.cos((startAngle+i*stepAngle)* (Math.PI/180));
			var y_tmp = y + height * Math.sin((startAngle+i*stepAngle)* (Math.PI/180));
			GraphicsFactoryHelper.addTriangle(x,y,x_tmp,y_tmp, x_last, y_last, 0, vertices, curves);
			x_last=x_tmp;
			y_last=y_tmp;
		}
	}
	public static drawElipseStrokes(x:number,y:number,width:number, height:number, vertices:Array<number>, startAngle:number, endAngle:number, stepAngle:number, thickness:number, curves:boolean):void
	{

		// todo: validate input / check edge cases
		var degreeTotal:number=endAngle-startAngle;
		var steps:number=degreeTotal/stepAngle;
		var x_last = x + (width + thickness) * Math.cos(startAngle* (Math.PI/180));
		var y_last = y + (height + thickness)* Math.sin(startAngle* (Math.PI/180));
		var x_last2 = x + (width - thickness) * Math.cos(startAngle* (Math.PI/180));
		var y_last2 = y + (height - thickness)* Math.sin(startAngle* (Math.PI/180));
		for(var i=1; i<=steps;i++){
			var x_tmp = x + (width+thickness) * Math.cos((startAngle+i*stepAngle)* (Math.PI/180));
			var y_tmp = y + (height+thickness) * Math.sin((startAngle+i*stepAngle)* (Math.PI/180));
			var x_tmp2 = x + (width-thickness) * Math.cos((startAngle+i*stepAngle)* (Math.PI/180));
			var y_tmp2 = y + (height-thickness) * Math.sin((startAngle+i*stepAngle)* (Math.PI/180));
			GraphicsFactoryHelper.addTriangle(x_tmp, y_tmp, x_tmp2, y_tmp2, x_last, y_last, 0, vertices, curves);
			GraphicsFactoryHelper.addTriangle(x_last2, y_last2, x_tmp2, y_tmp2, x_last, y_last, 0, vertices, curves);
			x_last=x_tmp;
			y_last=y_tmp;
			x_last2=x_tmp2;
			y_last2=y_tmp2;
		}
	}
	public static addTriangle(startX:number,startY:number, controlX:number, controlY:number, endX:number, endY:number, tri_type:number, vertices:Array<number>, curves:boolean):void
	{
		var x1=startX;
		var y1=startY;
		var x2=controlX;
		var y2=controlY;
		var x3=endX;
		var y3=endY;
		if(GraphicsFactoryHelper.isClockWiseXY(x1, y1, x2, y2, x3, y3)){
			startX=x3;
			startY=y3;
			controlX=x2;
			controlY=y2;
			endX=x1;
			endY=y1;
		}
		var final_vert_cnt:number = vertices.length;
		if(tri_type==0){
			vertices[final_vert_cnt++] = startX;
			vertices[final_vert_cnt++] = startY;
			if(curves)
				vertices[final_vert_cnt++] = 4.5736980577097704e-41;// ((127<<24)+(127<<16)+0+0)
			vertices[final_vert_cnt++] = controlX;
			vertices[final_vert_cnt++] = controlY;
			if(curves)
				vertices[final_vert_cnt++] = 4.5736980577097704e-41;// ((127<<24)+(127<<16)+0+0)
			vertices[final_vert_cnt++] = endX;
			vertices[final_vert_cnt++] = endY;
			if(curves)
				vertices[final_vert_cnt++] = 4.5736980577097704e-41;// ((127<<24)+(127<<16)+0+0)
		}
		else if(tri_type<0){
			vertices[final_vert_cnt++] = startX;
			vertices[final_vert_cnt++] = startY;
			if(curves)
				vertices[final_vert_cnt++] = 1.1708844992641982e-38;// ((127<<24)+(127<<16)+0+0)
			vertices[final_vert_cnt++] = controlX;
			vertices[final_vert_cnt++] = controlY;
			if(curves)
				vertices[final_vert_cnt++] = 2.2778106537599901e-41;// ((127<<24)+(63<<16)+0+0)
			vertices[final_vert_cnt++] = endX;
			vertices[final_vert_cnt++] = endY;
			if(curves)
				vertices[final_vert_cnt++] = 1.7796490496925177e-43;// ((127<<24)+0+0+0)
		}
		else if(tri_type>0){
			vertices[final_vert_cnt++] = startX;
			vertices[final_vert_cnt++] = startY;
			if(curves)
				vertices[final_vert_cnt++] = 1.1708846393940446e-38;// ((-128<<24)+(127<<16)+0+0)
			vertices[final_vert_cnt++] = controlX;
			vertices[final_vert_cnt++] = controlY;
			if(curves)
				vertices[final_vert_cnt++] = 2.2779507836064226e-41;// ((-128<<24)+(63<<16)+0+0)
			vertices[final_vert_cnt++] = endX;
			vertices[final_vert_cnt++] = endY;
			if(curves)
				vertices[final_vert_cnt++] = 1.793662034335766e-43;// ((-128<<24)+0+0+0)
		}
	}
	public static createCap(startX:number, startY:number, start_le:Point, start_ri:Point, dir_vec:Point, capstyle:number, cap_position:number, thickness:number, vertices:Array<number>, curves:boolean):void
	{
		if (capstyle == CapsStyle.ROUND) {
			//console.log("add round cap");
			var tmp1_x:number = startX + (cap_position * (dir_vec.x * thickness));
			var tmp1_y:number = startY + (cap_position * (dir_vec.y * thickness));
			tmp1_x = tmp1_x * 2 - start_le.x/2 - start_ri.x/2;
			tmp1_y = tmp1_y * 2 - start_le.y/2 - start_ri.y/2;
			GraphicsFactoryHelper.addTriangle(start_le.x, start_le.y, tmp1_x, tmp1_y, start_ri.x, start_ri.y, -1, vertices, curves);
		}
		else if (capstyle == CapsStyle.SQUARE) {
			//console.log("add square cap");
			var tmp1_x:number = start_le.x + (cap_position * (dir_vec.x * thickness));
			var tmp1_y:number = start_le.y + (cap_position * (dir_vec.y * thickness));
			var tmp2_x:number = start_ri.x + (cap_position * (dir_vec.x * thickness));
			var tmp2_y:number = start_ri.y + (cap_position * (dir_vec.y * thickness));

			GraphicsFactoryHelper.addTriangle(tmp2_x,tmp2_y, tmp1_x, tmp1_y, start_le.x, start_le.y, 0, vertices, curves);
			GraphicsFactoryHelper.addTriangle(tmp2_x,tmp2_y, start_le.x, start_le.y, start_ri.x, start_ri.y, 0, vertices, curves);
		}
	}
	public static getLineFormularData(a:Point, b:Point):Point
	{
		var tmp_x = b.x - a.x;
		var tmp_y = b.y - a.y;
		var return_point:Point=new Point();
		if ((tmp_x != 0)&&(tmp_y!=0))
			return_point.x = tmp_y / tmp_x;
		return_point.y = -(return_point.x * a.x - a.y);
		return return_point;
	}
	public static getQuadricBezierPosition(t, start, control, end):number
	{
		var xt = 1 - t;
		return xt * xt * start + 2 * xt * t * control + t * t * end;
	}
	public static subdivideCurve(startx:number, starty:number, cx:number, cy:number, endx:number, endy:number, startx2:number, starty2:number, cx2:number, cy2:number, endx2:number, endy2:number, array_out:Array<number>, array2_out:Array<number>):void
	{
		var angle_1:number=Math.atan2(cy - starty, cx - startx) * MathConsts.RADIANS_TO_DEGREES;
		var angle_2:number=Math.atan2(endy - cy, endx - cx) * MathConsts.RADIANS_TO_DEGREES;
		var angle_delta:number=angle_2 - angle_1;
		//console.log("angle_delta "+angle_delta);

		if(angle_delta>180){
			angle_delta-=360;
		}
		if(angle_delta<-180){
			angle_delta+=360;
		}
		if(Math.abs(angle_delta)>=175){
			array_out.push(startx, starty, cx, cy,  endx, endy);
			array2_out.push(startx2, starty2, cx2, cy2, endx2, endy2);
			return;
		}

		var b1:boolean=false;
		var b2:boolean=false;
		if(angle_delta<0){
			// curve is curved to right side. right side is convex
			b1 = GraphicsFactoryHelper.getSign(startx, starty, cx2, cy2, endx, endy) > 0;
			b2 = GraphicsFactoryHelper.getSign(startx, starty, cx, cy, endx, endy) > 0;
			b1 = (((starty-endy)*(cx-startx)+(endx-startx)*(cy-starty))*((starty-endy)*(cx2-startx)+(endx-startx)*(cy2-starty)))<0;

		}
		else{
			// curve is curved to left side. left side is convex
			b1 = GraphicsFactoryHelper.getSign(startx2, starty2, cx2, cy2, endx2, endy2) > 0;
			b2 = GraphicsFactoryHelper.getSign(startx2, starty2, cx, cy, endx2, endy2) > 0;
			b1 = (((starty2-endy)*(cx-startx2)+(endx2-startx2)*(cy-starty2))*((starty2-endy2)*(cx2-startx2)+(endx2-startx2)*(cy2-starty2)))<0;

		}
		if(b1){
			array_out.push(startx, starty, cx, cy,  endx, endy);
			array2_out.push(startx2, starty2, cx2, cy2, endx2, endy2);
			return;
		}
		// triangles overlap. we must subdivide:

		var c1x = startx + (cx - startx) * 0.5;// new controlpoint 1.1
		var c1y = starty + (cy - starty) * 0.5;
		var c2x = cx + (endx - cx) * 0.5;// new controlpoint 1.2
		var c2y = cy + (endy - cy) * 0.5;
		var ax = c1x + (c2x - c1x) * 0.5;// new middlepoint 1
		var ay = c1y + (c2y - c1y) * 0.5;

		var c1x2 = startx2 + (cx2 - startx2) * 0.5;// new controlpoint 2.1
		var c1y2 = starty2 + (cy2 - starty2) * 0.5;
		var c2x2 = cx2 + (endx2 - cx2) * 0.5;// new controlpoint 2.2
		var c2y2 = cy2 + (endy2 - cy2) * 0.5;
		var ax2 = c1x2 + (c2x2 - c1x2) * 0.5;// new middlepoint 2
		var ay2 = c1y2 + (c2y2 - c1y2) * 0.5;

		GraphicsFactoryHelper.subdivideCurve(startx, starty, c1x, c1y, ax, ay, startx2, starty2, c1x2, c1y2, ax2, ay2, array_out, array2_out);
		GraphicsFactoryHelper.subdivideCurve(ax, ay, c2x, c2y, endx, endy, ax2, ay2, c2x2, c2y2, endx2, endy2, array_out, array2_out);

	}
	public static tesselateCurve(startx:number, starty:number, cx:number, cy:number, endx:number, endy:number, array_out:Array<number>):void
	{
		var angle_1:number=Math.atan2(cy - starty, cx - startx) * MathConsts.RADIANS_TO_DEGREES;
		var angle_2:number=Math.atan2(endy - cy, endx - cx) * MathConsts.RADIANS_TO_DEGREES;
		var angle_delta:number=angle_2 - angle_1;
		//console.log("angle_delta "+angle_delta);

		while(angle_delta>180){
			angle_delta-=360;
		}
		while(angle_delta<-180){
			angle_delta+=360;
		}

		var diff_x=endx-startx;
		var diff_y=endy-starty;
		var len:number=Math.sqrt(diff_x*diff_x + diff_y*diff_y);
		//console.log("len", len, "angle_delta", angle_delta);
		// if the curve angle is smaller than threshold_ang_2 and the len is smaller than threshold_len, we just early out. we will not use the ctr-point at all
		
		// todo: find best constants / checks to test if a curve need more subdividing
		
		/*if(Math.abs(angle_delta)>=150 && len <=3){
			array_out.push(endx, endy);
			return;			
		}*/
		if(Math.abs(angle_delta)<=2 || len<=5 ){
			array_out.push(endx, endy);
			return;
		}


		// curve needs to be subdivided:
		
		var c1x = startx + (cx - startx) * 0.5;// new controlpoint 1
		var c1y = starty + (cy - starty) * 0.5;
		var c2x = cx + (endx - cx) * 0.5;// new controlpoint 2
		var c2y = cy + (endy - cy) * 0.5;
		var ax = c1x + (c2x - c1x) * 0.5;// new middlepoint 1
		var ay = c1y + (c2y - c1y) * 0.5;

		GraphicsFactoryHelper.tesselateCurve(startx, starty, c1x, c1y, ax, ay, array_out);
		GraphicsFactoryHelper.tesselateCurve(ax, ay, c2x, c2y, endx, endy, array_out);

	}
}