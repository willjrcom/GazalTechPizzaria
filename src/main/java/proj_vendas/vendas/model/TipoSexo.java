package proj_vendas.vendas.model;

public enum TipoSexo {
	MASCULINO("Masculino"),
	FEMINIMO("Feminino");
	
	private String descricao;
	
	TipoSexo(String descricao){
		this.descricao = descricao;
	}
	
	public String getDescricao() {
		return descricao;
	}
}
