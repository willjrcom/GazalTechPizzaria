package proj_vendas.vendas.model;

public enum TipoDisponivel {
	DISPONIVEL("Disponível"),
	INDISPONIVEL("Indisponivel");
	
	private String descricao;
	
	TipoDisponivel(String descricao){
		this.descricao = descricao;
	}
	
	public String getDescricao() {
		return descricao;
	}
}
