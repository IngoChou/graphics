import {SamplerCube} from "../image/SamplerCube";
import {ImageCube} from "../image/ImageCube";

import {MappingMode} from "./MappingMode";
import {TextureBase} from "./TextureBase";


export class SingleCubeTexture extends TextureBase
{
	public static assetType:string = "[texture SingleCubeTexture]";

	/**
	 *
	 * @returns {string}
	 */
	public get assetType():string
	{
		return SingleCubeTexture.assetType;
	}

	/**
	 *
	 * @returns {Image2D}
	 */
	public get samplerCube():SamplerCube
	{
		return <SamplerCube> this._samplers[0];
	}

	public set samplerCube(value:SamplerCube)
	{
		if (this._samplers[0] == value)
			return;

		this.setSamplerAt(value, 0);
	}

	/**
	 *
	 * @returns {ImageCube}
	 */
	public get imageCube():ImageCube
	{
		return <ImageCube> this._images[0];
	}

	public set imageCube(value:ImageCube)
	{
		if (this._images[0] == value)
			return;

		this.setImageAt(value, 0);
	}

	
	constructor(imageCube:ImageCube = null)
	{
		super();

		this._mappingMode = MappingMode.CUBE;

		this.setNumImages(1);

		this.imageCube = imageCube;
	}
}