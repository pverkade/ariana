
interface SelectionInterface {
	maskBorder : Uint8Array;
	maskWand : Uint8Array;
	maskWandParts : Uint8Array[];
	
	width : number;
	height : number;


	clearLast() : boolean;
}