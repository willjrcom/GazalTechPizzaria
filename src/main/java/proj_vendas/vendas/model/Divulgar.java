package proj_vendas.vendas.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import lombok.Data;
import lombok.EqualsAndHashCode;
import proj_vendas.vendas.domain.AbstractEntity;

@Data
@EqualsAndHashCode(callSuper=true)
@SuppressWarnings("serial")
@Entity
@Table(name = "DIVULGACAO")
public class Divulgar extends AbstractEntity<Long> {

	@Column(nullable = false)
	private boolean mostrarNovidades;
	
	@Column(nullable = false)
	private String texto1;
	
	@Column(nullable = false)
	private String link1;
	
	@Column(nullable = false)
	private String empresa1;
	
	@Column(nullable = false)
	private String datai1;
	
	@Column(nullable = false)
	private String dataf1;
	
	@Column(nullable = false)
	private float valor1;
	

	@Column(nullable = false)
	private String texto2;
	
	@Column(nullable = false)
	private String link2;
	
	@Column(nullable = false)
	private String empresa2;
	
	@Column(nullable = false)
	private String datai2;
	
	@Column(nullable = false)
	private String dataf2;
	
	@Column(nullable = false)
	private float valor2;

	@Column(nullable = false)
	private String texto3;
	
	@Column(nullable = false)
	private String link3;
	
	@Column(nullable = false)
	private String empresa3;
	
	@Column(nullable = false)
	private String datai3;
	
	@Column(nullable = false)
	private String dataf3;
	
	@Column(nullable = false)
	private float valor3;

	@Column(nullable = false)
	private String texto4;
	
	@Column(nullable = false)
	private String link4;
	
	@Column(nullable = false)
	private String empresa4;
	
	@Column(nullable = false)
	private String datai4;
	
	@Column(nullable = false)
	private String dataf4;
	
	@Column(nullable = false)
	private float valor4;
	
	@Column(nullable = false)
	private String texto5;
	
	@Column(nullable = false)
	private String link5;
	
	@Column(nullable = false)
	private String empresa5;
	
	@Column(nullable = false)
	private String datai5;
	
	@Column(nullable = false)
	private String dataf5;
	
	@Column(nullable = false)
	private float valor5;
}


