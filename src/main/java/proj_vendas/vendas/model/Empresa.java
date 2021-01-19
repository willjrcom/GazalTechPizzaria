package proj_vendas.vendas.model;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import lombok.Data;
import lombok.EqualsAndHashCode;
import proj_vendas.vendas.domain.AbstractEntity;

@Data
@EqualsAndHashCode(callSuper=true)
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
}
