package Bazaar.com.project.feature._common.cloudinary;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CloudinaryResDto {
    private String publicId;
    private String url;
    private Long version;
}
