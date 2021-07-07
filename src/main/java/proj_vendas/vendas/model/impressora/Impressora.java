package proj_vendas.vendas.model.impressora;

public interface Impressora {
	/***
	* Comandos EPSON Fx-850 p/ Impressora Citizen GSX-190
	***/
	
	/**Printer control comands**/
	static final public String MASTER_RESET = "\\u001B"+"@"; //ok
	static final public String DELETE_CHARACTER = "\\u007F";
	static final public String CANCEL_LINE = "\\u0018";
	static final public String UNIDIRECIONAL_ON = "\\u001B"+"U"+(char)1;
	static final public String UNIDIRECIONAL_OFF = "\\u001B"+"U"+(char)0;
	static final public String HALF_SPEED_ON = "\\u001B"+"s"+(char)1;
	static final public String HALF_SPEED_OFF = "\\u001B"+"s"+(char)0;
	static final public String IMMEDIATE_MODE_ON = "\\u001B"+"i"+(char)1;
	static final public String IMMEDIATE_MODE_OFF = "\\u001B"+"i"+(char)0;
	
	/**Vertical comands**/
	static final public String ONE_LINE = "\\n";
	static final public String N_LINES = "\\u001B"+"f"+(char)1; //ESC f n onde n é o numero de linhas
	static final public String FORM_FEED = "\\f";
	static final public String ADVANCE_N_216_INCH = "\\u001B"+"J"; //ESC J n onde n é n/216 inch
	static final public String RETRACT_N_216_INCH = "\\u001B"+"j"; //ESC j n onde n é n/216 inch
	static final public String PAGE_LEGTH_LINES = "\\u001B"+"C"; //ESC C n onde n é o tamanho da pagina em linhas
	static final public String PAGE_LEGTH_INCHES = "\\u001B"+"C"+(char)0; //ESC C n onde n é o tamanho da pagina em polegadas
	static final public String SPACING_1_6 = "\\u001B"+"2";
	static final public String SPACING_1_8 = "\\u001B"+"0";
	static final public String SPACING_7_72 = "\\u001B"+"1";
	static final public String SPACING_N_72 = "\\u001B"+"A"; //ESC A n onde n é n/72 inch de espacamento entre linhas
	static final public String SPACING_N_216 = "\\u001B"+"3";////ESC 3 n onde n é n/216 inch de espacamento entre linhas
	
	/**Horizontal comands**/
	static final public String CARRIAGE_RETURN = "\\r";
	static final public String N_COL_RIGTH = "\\u001B"+"f"+(char)0; //ESC f n onde n é o número de colunas para direita
	static final public String MARGIN_LEFT = "\\u001B"+"l";//ESC l n onde n é o tamanho da margem esquerda em colunas
	static final public String MARGIN_RIGTH = "\\u001B"+"Q";//ESC Q n onde n é o tamanho da margem direita em colunas
	static final public String ABSOLUTE_POSITION = "\\u001B"+"$"; //ESC $ n1 n2
	static final public String RELATIVE_POSITION = "\\u001B"+"\\\\"; //ESC \\ n1 n2
	
	/**Print style comands**/
	static final public String NEAR_LETTER_QUALITY = "\\u001B"+"x"+(char)0; //MODO LIGADO
	static final public String DRAFT = "\\u001B"+"x"+(char)0; //MODO DESLIGADO
	static final public String ROMAN = "\\u001B"+"k"+(char)0;
	static final public String SANS_SERIF = "\\u001B"+"k"+(char)1;
	static final public String COURIER = "\\u001B"+"k"+(char)2;
	static final public String PRESTIGE = "\\u001B"+"k"+(char)3;
	static final public String SCRIPT = "\\u001B"+"k"+(char)4;
	static final public String ORATOR = "\\u001B"+"k"+(char)7;
	static final public String SEL_PRINT_STYLE = "\\u001B"+"!";
	/*ESC ! n onde n é a soma dos atributos:
	*Elite = 1; Proportional = 2; Condensed = 4; Emphasized = 8; Doublestrike = 16; Expanded = 32; Italic = 64; Underline = 128*/
	
	/**Print size comands**/
	static final public String PITCH_PICA = "\\u001B"+"P";
	static final public String EXPANDED_ON = "\\u001B"+"W"+(char)1;
	static final public String EXPANDED_OFF = "\\u001B"+"W"+(char)0;
	/*static final public char CONDENSED_ON = 15;
	static final public char CONDENSED_OFF = 18;*/
	static final public char CONDENSED_ON = (char)15;
	static final public char CONDENSED_OFF = (char)18;
	static final public String PROPORTIONAL_ON = "\\u001B"+"p"+(char)1;
	static final public String PROPORTIONAL_OFF = "\\u001B"+"p"+(char)0;
	static final public String DOUBLE_HIGH_ON = "\\u001B"+"w"+(char)1;
	static final public String DOUBLE_HIGH_OFF = "\\u001B"+"w"+(char)0;
	
	/**Print Enhancement comands**/
	static final public String EMPHASIZED_ON = "\\u001B"+"E";
	static final public String EMPHASIZED_OFF ="\\u001B"+"F";
	static final public String DOUBLE_STRIKE_ON = "\\u001B"+"G";
	static final public String DOUBLE_STRIKE_OFF = "\\u001B"+"H";
	static final public String ITALIC_ON = "\\u001B"+(char)4;
	static final public String ITALIC_OFF = "\\u001B"+(char)5;
	static final public String UNDERLINING_ON = "\\u001B"+"-"+(char)1;
	static final public String UNDERLINING_OFF = "\\u001B"+"-"+(char)0;
	
	static final String CPI_10 = "\\u001B" + "!" + (char)0;
	static final String CPI_12 = "\\u001B" + "M";
	static final String CPI_15 = "\\u001B" + "g";
	static final String CPI_56 = "\\u001B" + "!" + (char)56;
	
	static final String EPSON_EMULATION = "\\u001B"+"~"+(char)5+(char)0;
	
	static final String TABELA_CARACTERES = "\\u001B" + "R" + (char)0;
	static final String TABELA_CARACTERES_2 = "\\u001B" + "R" + (char)12;
}