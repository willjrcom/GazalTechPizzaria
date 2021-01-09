package proj_vendas.vendas.model;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import proj_vendas.vendas.domain.AbstractEntity;

@SuppressWarnings("serial")
@Entity
@Table(name = "EMPRESA")
public class Empresa extends AbstractEntity<Long>{
	
	@Column(nullable=false)
	private String nomeEstabelecimento;
	
	@Column(nullable=false)
	private String nomeEmpresa;
	
	@Column(nullable=false)
	private String cnpj;
	
	@Column(nullable=false)
	private String email;
	
	@Column(nullable=false)
	private String celular;
	
	private double horaExtra = 1;
	private int mesa;
	private String funcionamento;
	private float taxaEntrega;
	private float taxaMesa;
	
	//impressao
	private String promocao;
	private String texto1;
	private String texto2;
	private boolean imprimir;
	private boolean impressoraOnline;
	
	@OneToOne(cascade = CascadeType.ALL)
	private Endereco endereco;

	@Column(nullable=false)
	private int codEmpresa;
	
	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}
	
	public String getCelular() {
		return celular;
	}

	public void setCelular(String celular) {
		this.celular = celular;
	}

	public Endereco getEndereco() {
		return endereco;
	}

	public void setEndereco(Endereco endereco) {
		this.endereco = endereco;
	}

	public String getCnpj() {
		return cnpj;
	}

	public void setCnpj(String cnpj) {
		this.cnpj = cnpj;
	}

	public String getNomeEstabelecimento() {
		return nomeEstabelecimento;
	}

	public void setNomeEstabelecimento(String nomeEstabelecimento) {
		this.nomeEstabelecimento = nomeEstabelecimento;
	}

	public String getNomeEmpresa() {
		return nomeEmpresa;
	}

	public void setNomeEmpresa(String nomeEmpresa) {
		this.nomeEmpresa = nomeEmpresa;
	}

	public double getHoraExtra() {
		return horaExtra;
	}

	public void setHoraExtra(double horaExtra) {
		this.horaExtra = horaExtra;
	}

	public int getMesa() {
		return mesa;
	}

	public void setMesa(int mesa) {
		this.mesa = mesa;
	}

	public String getPromocao() {
		return promocao;
	}

	public void setPromocao(String promocao) {
		this.promocao = promocao;
	}

	public String getTexto1() {
		return texto1;
	}

	public void setTexto1(String texto1) {
		this.texto1 = texto1;
	}

	public String getTexto2() {
		return texto2;
	}

	public void setTexto2(String texto2) {
		this.texto2 = texto2;
	}

	public boolean isImprimir() {
		return imprimir;
	}

	public void setImprimir(boolean imprimir) {
		this.imprimir = imprimir;
	}

	public String getFuncionamento() {
		return funcionamento;
	}

	public void setFuncionamento(String funcionamento) {
		this.funcionamento = funcionamento;
	}

	public boolean isImpressoraOnline() {
		return impressoraOnline;
	}

	public void setImpressoraOnline(boolean impressoraOnline) {
		this.impressoraOnline = impressoraOnline;
	}

	public float getTaxaEntrega() {
		return taxaEntrega;
	}

	public void setTaxaEntrega(float taxaEntrega) {
		this.taxaEntrega = taxaEntrega;
	}

	public float getTaxaMesa() {
		return taxaMesa;
	}

	public void setTaxaMesa(float taxaMesa) {
		this.taxaMesa = taxaMesa;
	}

	public int getCodEmpresa() {
		return codEmpresa;
	}

	public void setCodEmpresa(int codEmpresa) {
		this.codEmpresa = codEmpresa;
	}
	
	
}
