package proj_vendas.vendas.model;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.springframework.stereotype.Service;

import proj_vendas.vendas.domain.AbstractEntity;

@SuppressWarnings("serial")
@Entity
@Table(name = "CLIENTES")
@Service
public class Cliente extends AbstractEntity<Long> {

	@Column(nullable=false)
	private String nome;

	private String cpf;

	@Column(unique = true, nullable=false)
	private String celular;
	
	@OneToOne(cascade = CascadeType.ALL)
	private Endereco endereco;

	private String dataCadastro;
	private int contPedidos = 0;
	
	@Column(nullable=false)
	private int codEmpresa;

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public String getCpf() {
		return cpf;
	}

	public void setCpf(String cpf) {
		this.cpf = cpf;
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

	public String getDataCadastro() {
		return dataCadastro;
	}

	public void setDataCadastro(String dataCadastro) {
		this.dataCadastro = dataCadastro;
	}

	public int getContPedidos() {
		return contPedidos;
	}

	public void setContPedidos(int contPedidos) {
		this.contPedidos = contPedidos;
	}

	public int getCodEmpresa() {
		return codEmpresa;
	}

	public void setCodEmpresa(int codEmpresa) {
		this.codEmpresa = codEmpresa;
	}
}


