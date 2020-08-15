package proj_vendas.vendas.model;

public enum TipoProduto {
	PIZZA("Pizza"),
	BEBIDA("Bebida"),
	OUTROS("Outros");
	
	private String descricao;
	
	TipoProduto(String descricao){
		this.descricao = descricao;
	}
	
	public String getDescricao() {
		return descricao;
	}
}
