package proj_vendas.vendas.model;

public enum TipoStatus {
	//Status para entregas
	COZINHA("Em preparação"),
	PRONTO("Pronto"),
	MOTOBOY("Na Rua"),
	FINALIZADO("Finalizado"),
	EXCLUIDO("Excluido");
	
	private String descricao;

	TipoStatus(String descricao){
		this.descricao = descricao;
	}
	
	public String getDescricao() {
		return descricao;
	}

	public void setDescricao(String descricao) {
		this.descricao = descricao;
	}
}
