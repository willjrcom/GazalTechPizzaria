package proj_vendas.vendas.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import org.springframework.stereotype.Service;

import proj_vendas.vendas.domain.AbstractEntity;

@SuppressWarnings("serial")
@Entity
@Table(name = "PRODUTOS")
@Service
public class Produto extends AbstractEntity<Long> {
	
	@Column(nullable=false)
	private String codigoBusca;
	
	@Column(nullable=false)
	private String nomeProduto;
	
	@Column(nullable=false)
	private String preco;
	private String custo;
	
	@Column(nullable=false)
	private String setor;
	private String descricao;
	
	@Column(nullable=false)
	private boolean disponivel;
	
	@Column(nullable=false)
	private int codEmpresa;
	
	public String getCodigoBusca() {
		return codigoBusca;
	}
	public void setCodigoBusca(String codigoBusca) {
		this.codigoBusca = codigoBusca;
	}
	public String getNomeProduto() {
		return nomeProduto;
	}
	public void setNomeProduto(String nomeProduto) {
		this.nomeProduto = nomeProduto;
	}
	public String getPreco() {
		return preco;
	}
	public void setPreco(String preco) {
		this.preco = preco;
	}
	public String getSetor() {
		return setor;
	}
	public void setSetor(String setor) {
		this.setor = setor;
	}
	public String getDescricao() {
		return descricao;
	}
	public void setDescricao(String descricao) {
		this.descricao = descricao;
	}
	public String getCusto() {
		return custo;
	}
	public void setCusto(String custo) {
		this.custo = custo;
	}
	public boolean getDisponivel() {
		return disponivel;
	}
	public void setDisponivel(boolean disponivel) {
		this.disponivel = disponivel;
	}
	public int getCodEmpresa() {
		return codEmpresa;
	}
	public void setCodEmpresa(int codEmpresa) {
		this.codEmpresa = codEmpresa;
	}
	
	
}
