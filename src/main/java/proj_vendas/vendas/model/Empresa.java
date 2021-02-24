package proj_vendas.vendas.model;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
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
@Table(name = "EMPRESAS")
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
	
	private float horaExtra = 10;
	private int mesa;
	private String funcionamento;
	
	//impressao
	private String promocao;
	private String texto1;
	private String texto2;
	private boolean imprimir;
	
	@OneToOne(cascade = CascadeType.ALL)
	private Endereco endereco;

	@OneToMany(cascade = CascadeType.ALL)
	private List<Pagamento> pagamento;
	
	@OneToOne(cascade = CascadeType.ALL)
	private Conquista conquista;
	
	@Column(nullable=false)
	private int codEmpresa;
}
