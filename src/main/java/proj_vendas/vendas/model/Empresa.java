package proj_vendas.vendas.model;

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

@Data
@EqualsAndHashCode(callSuper=true)
@SuppressWarnings("serial")
@Entity
@Table(name = "EMPRESA", indexes = @Index(name = "codEmpresa_index", columnList = "codEmpresa"))
public class Empresa extends AbstractEntity<Long>{
	
	@Column(nullable=false)
	private int codEmpresa;
	
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
	
	
	@Column(nullable = false)
	private float horaExtra = 10;
	
	@Column(nullable = false)
	private int mesa;
	
	@Column(nullable = false)
	private String funcionamento;
	
	//impressao
	@Column(nullable = false)
	private String promocao;
	
	@Column(nullable = false)
	private String texto1;
	
	@Column(nullable = false)
	private String texto2;
	
	@Column(nullable = false)
	private boolean imprimir;
	
	@Column(nullable = false)
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
