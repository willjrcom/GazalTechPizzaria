package proj_vendas.vendas.model;

public enum TipoEnvio {
	//Status para enviar pedido
	MESA("Mesa"),
	BALCAO("Balcão"),
	ENTREGA("Entrega"),
	IFOOD("Ifood"),
	DRIVE("Drive-thru");
	
	private String descricao;

	TipoEnvio(String descricao){
		this.descricao = descricao;
	}
	
	public String getDescricao() {
		return descricao;
	}

	public void setDescricao(String descricao) {
		this.descricao = descricao;
	}
}
