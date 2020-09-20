package proj_vendas.vendas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import proj_vendas.vendas.model.Usuario;

public interface Usuarios extends JpaRepository<Usuario, Long>{
	
	@Query("select u from Usuario u where u.email like :email")
	public Usuario findByEmail(@Param("email") String email);
	
	@Query("select u from Usuario u where u.email = 'willjrcom'")
	public Usuario findMeuEmail();
}
