import {BitmapImage2D} from "../image/BitmapImage2D";
import {DefaultGraphicsFactory} from "../factories/DefaultGraphicsFactory";
import {Image2D} from "../image/Image2D";
import {IGraphicsFactory} from "../factories/IGraphicsFactory";

export class ImageUtils
{
	private static MAX_SIZE:number = 8192;
	
	/**
	 *
	 */
	public static imageToBitmapImage2D(img:HTMLImageElement, powerOfTwo:boolean = true, factory:IGraphicsFactory = null):BitmapImage2D
	{
		if (!factory)
			factory = new DefaultGraphicsFactory();
		var image2D:BitmapImage2D = <BitmapImage2D> factory.createImage2D(img.naturalWidth, img.naturalHeight, true, null, powerOfTwo);
		image2D.draw(img);

		return image2D;
	}
	
	public static isImage2DValid(image2D:Image2D):boolean
	{
		if (image2D == null)
			return true;

		return ImageUtils.isDimensionValid(image2D.width, image2D.powerOfTwo) && ImageUtils.isDimensionValid(image2D.height, image2D.powerOfTwo);
	}

	public static isHTMLImageElementValid(image:HTMLImageElement):boolean
	{
		if (image == null)
			return true;

		return ImageUtils.isDimensionValid(image.width) && ImageUtils.isDimensionValid(image.height);
	}

	public static isDimensionValid(d:number, powerOfTwo:boolean = true):boolean
	{
		return d >= 1 && d <= ImageUtils.MAX_SIZE && (!powerOfTwo || ImageUtils.isPowerOfTwo(d));
	}

	public static isPowerOfTwo(value:number):boolean
	{
		return value? ((value & -value) == value) : false;
	}

	public static getBestPowerOf2(value:number):number
	{
		var p:number = 1;

		while (p < value)
			p <<= 1;

		if (p > ImageUtils.MAX_SIZE)
			p = ImageUtils.MAX_SIZE;

		return p;
	}
}

export default ImageUtils