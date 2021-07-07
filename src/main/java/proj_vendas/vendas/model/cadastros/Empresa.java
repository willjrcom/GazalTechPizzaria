package proj_vendas.vendas.model.cadastros;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Index;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import lombok.Data;
import lombok.EqualsAndHashCode;
import proj_vendas.vendas.domain.AbstractEntity;
import proj_vendas.vendas.model.empresa.Conquista;
import proj_vendas.vendas.model.empresa.Dado;
import proj_vendas.vendas.model.empresa.Mensalidade;
import proj_vendas.vendas.model.log.LogMesa;
import proj_vendas.vendas.model.log.LogPizza;

@Data
@EqualsAndHashCode(callSuper=true)
@SuppressWarnings("serial")
@Entity
@Table(name = "EMPRESA", indexes = @Index(name = "codEmpresa_index", columnList = "codEmpresa"))
public class Empresa extends AbstractEntity<Long>{
	
	@Column(nullable=false)
	private Long codEmpresa;
	
	@Column
	private String nomeEstabelecimento;
	
	@Column
	private String nomeEmpresa;
	
	@Column(nullable=false)
	private String cnpj;

	@Column
	private String email;

	@Column
	private String celular;
	

	@Column
	private float horaExtra = 10;

	@Column
	private int mesa = 0;

	@Column
	private String funcionamento;
	
	//impressao
	@Column
	private String promocao;

	@Column
	private String texto1;

	@Column
	private String texto2;

	@Column
	private boolean imprimir;

	@Column
	private boolean imprimirPizza;
	
	@OneToOne(cascade = CascadeType.ALL)
	private Endereco endereco;

	@OneToOne(cascade = CascadeType.ALL)
	private Conquista conquista;
	
	@OneToMany(cascade = CascadeType.ALL)
	private List<Cliente> cliente;
	
	@OneToMany(cascade = CascadeType.ALL)
	private List<Funcionario> funcionario;
	
	@OneToMany(cascade = CascadeType.ALL)
	private List<Produto> produto;
	
	@OneToMany(cascade = CascadeType.ALL)
	private List<Dado> dado;
	
	@OneToMany(cascade = CascadeType.ALL)
	private List<Mensalidade> mensalidade;

	@OneToMany(cascade = CascadeType.ALL)
	private List<Cupom> cupom;
	
	@OneToMany(cascade = CascadeType.ALL)
	private List<LogMesa> logMesa;

	@OneToMany(cascade = CascadeType.ALL)
	private List<LogPizza> logPizza;
	
	@OneToMany(cascade = CascadeType.ALL)
	private List<FichaTecnica> fichaTecnica;
}
