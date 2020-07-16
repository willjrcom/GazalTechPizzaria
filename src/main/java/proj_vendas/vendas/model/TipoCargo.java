package proj_vendas.vendas.model;

public enum TipoCargo {
	MOTOBOY("Motoboy"),
	CLT("CLT"),
	MENORAPRENDIZ("Menor Aprendiz");
	
	private String descricao;
	
	TipoCargo(String descricao){
		this.descricao = descricao;
	}
	
	public String getDescricao() {
		return descricao;
	}
}
